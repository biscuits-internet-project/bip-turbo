"""Replace the zone's custom WAF, rate limiting and cache rules with the JSON files here,
after syncing the account IP list the WAF rules reference (proxy-ranges.txt).

Run: doppler run -p bip -c prd_hetzner -- python3 ops/cloudflare/apply.py
Needs CLOUDFLARE_SECURITY_TOKEN (Zone WAF edit, Account Filter Lists edit) and CLOUDFLARE_ZONE_ID.
"""

import json
import os
import pathlib
import time
import urllib.error
import urllib.request

TOKEN = os.environ["CLOUDFLARE_SECURITY_TOKEN"]
ZONE = os.environ["CLOUDFLARE_ZONE_ID"]
HERE = pathlib.Path(__file__).parent
PROXY_LIST = "bip_proxy_ranges"


def api(method, path, body=None):
    req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4{path}",
        json.dumps(body).encode() if body is not None else None,
        {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
        method=method,
    )
    try:
        return json.load(urllib.request.urlopen(req))["result"]
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{method} {path}: HTTP {e.code}: {e.read().decode()[:500]}")


# The WAF rules reference this list by name, so it has to exist and be current first.
account = api("GET", f"/zones/{ZONE}")["account"]["id"]
ranges = [
    line.strip()
    for line in (HERE / "proxy-ranges.txt").read_text().splitlines()
    if line.strip() and not line.startswith("#")
]
lists = {lst["name"]: lst for lst in api("GET", f"/accounts/{account}/rules/lists")}
if PROXY_LIST not in lists:
    lists[PROXY_LIST] = api(
        "POST",
        f"/accounts/{account}/rules/lists",
        {"name": PROXY_LIST, "kind": "ip", "description": "Proxy ranges challenged by the WAF (ops/cloudflare/proxy-ranges.txt)"},
    )
list_id = lists[PROXY_LIST]["id"]
operation = api("PUT", f"/accounts/{account}/rules/lists/{list_id}/items", [{"ip": r} for r in ranges])["operation_id"]
for _ in range(30):
    status = api("GET", f"/accounts/{account}/rules/lists/bulk_operations/{operation}")
    if status["status"] in ("completed", "failed"):
        break
    time.sleep(1)
if status["status"] != "completed":
    raise SystemExit(f"{PROXY_LIST}: list update {status['status']}: {status.get('error', '')}")
print(f"list {PROXY_LIST}: {len(ranges)} ranges")
RULESETS = {
    "http_request_firewall_custom": "waf-custom-rules.json",
    "http_ratelimit": "rate-limit-rules.json",
    "http_request_cache_settings": "cache-rules.json",
}

for phase, filename in RULESETS.items():
    body = json.loads((pathlib.Path(__file__).parent / filename).read_text())
    req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4/zones/{ZONE}/rulesets/phases/{phase}/entrypoint",
        json.dumps(body).encode(),
        {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
        method="PUT",
    )
    try:
        result = json.load(urllib.request.urlopen(req))["result"]
    except urllib.error.HTTPError as e:
        raise SystemExit(f"{phase}: HTTP {e.code}: {e.read().decode()[:500]}")

    for rule in result["rules"]:
        print(f"{rule['action']:18} enabled={rule['enabled']}  {rule['description']}")

# Sends a cache miss through one Cloudflare location instead of each one that sees it, so
# a crawl from IPs around the world doesn't fetch the same page once per location.
req = urllib.request.Request(
    f"https://api.cloudflare.com/client/v4/zones/{ZONE}/cache/tiered_cache_smart_topology_enable",
    json.dumps({"value": "on"}).encode(),
    {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"},
    method="PATCH",
)
try:
    print("tiered cache:", json.load(urllib.request.urlopen(req))["result"]["value"])
except urllib.error.HTTPError as e:
    raise SystemExit(f"tiered cache: HTTP {e.code}: {e.read().decode()[:500]}")
