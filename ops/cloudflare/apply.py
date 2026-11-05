"""Replace the zone's custom WAF, rate limiting and cache rules with the JSON files here.

Run: doppler run -p bip -c prd_hetzner -- python3 ops/cloudflare/apply.py
Needs CLOUDFLARE_SECURITY_TOKEN (Zone WAF edit) and CLOUDFLARE_ZONE_ID.
"""

import json
import os
import pathlib
import urllib.error
import urllib.request

TOKEN = os.environ["CLOUDFLARE_SECURITY_TOKEN"]
ZONE = os.environ["CLOUDFLARE_ZONE_ID"]
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
