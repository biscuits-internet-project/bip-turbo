"""Read-only report on the live Cloudflare rulesets compared with the repo files.

Why it exists: before anything writes to the zone, we want to learn the shape of
the live rulesets (which fields Cloudflare adds, which rules differ), what the
API token can read, and whether Cloudflare keeps ruleset versions.

It only issues GET requests. It prints only HTTP statuses, Cloudflare error
codes, rule refs, field names, counts and the tiered-cache on/off value, because
run logs on this public repo are world-readable. It never prints the token, the
zone id, or any value taken from a response beyond those.

Run: invoked from the Server Ops workflow (ops.yml, action inspect-cloudflare).
Needs CLOUDFLARE_SECURITY_TOKEN and CLOUDFLARE_ZONE_ID. It is a report, not a
gate, so it exits 0 whatever it finds.
"""

import json
import os
import pathlib
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
DIRECTORY = pathlib.Path(__file__).parent
RULESETS = {
    "http_request_firewall_custom": "waf-custom-rules.json",
    "http_ratelimit": "rate-limit-rules.json",
    "http_request_cache_settings": "cache-rules.json",
}


def get(token, path):
    """Single choke point for HTTP so the script provably only ever GETs.

    Returns (status, parsed JSON or None); status is None when the network fails.
    """
    request = urllib.request.Request(
        f"{API}/{path}", headers={"Authorization": f"Bearer {token}"}, method="GET"
    )
    try:
        with urllib.request.urlopen(request) as response:
            return getattr(response, "status", 200), json.load(response)
    except urllib.error.HTTPError as error:
        try:
            return error.code, json.load(error)
        except ValueError:
            return error.code, None
    except urllib.error.URLError:
        return None, None


def comparable_list(items):
    """Order-insensitive form of a list so reordering by Cloudflare is not drift."""
    return sorted(json.dumps(item, sort_keys=True) for item in items)


def differing_paths(repo_rule, live_rule, prefix=""):
    """Names every field that differs in either direction, never the values.

    Printing names only keeps the public log free of rule content while still
    showing which fields Cloudflare adds or rewrites.
    """
    paths = []
    for key in set(repo_rule) | set(live_rule):
        path = f"{prefix}{key}"
        if key not in repo_rule:
            paths.append(f"{path} (live only)")
        elif key not in live_rule:
            paths.append(f"{path} (repo only)")
        else:
            repo_value, live_value = repo_rule[key], live_rule[key]
            if isinstance(repo_value, dict) and isinstance(live_value, dict):
                paths.extend(differing_paths(repo_value, live_value, f"{path}."))
            elif isinstance(repo_value, list) and isinstance(live_value, list):
                if comparable_list(repo_value) != comparable_list(live_value):
                    paths.append(path)
            elif repo_value != live_value:
                paths.append(path)
    return sorted(paths)


def error_codes(body):
    """Extracts only the integer error codes, since messages could echo request details."""
    if not isinstance(body, dict):
        return []
    return [item.get("code") for item in body.get("errors") or [] if isinstance(item, dict)]


def report_rules(live_rules, repo_rules):
    """Prints per-ref match status between the live and repo rules."""
    repo_by_ref = {rule["ref"]: rule for rule in repo_rules}
    live_refs = set()
    for live_rule in live_rules:
        ref = live_rule.get("ref")
        label = ref if ref is not None else "<no ref>"
        live_refs.add(ref)
        repo_rule = repo_by_ref.get(ref) if ref is not None else None
        if repo_rule is None:
            print(f"  {label}: not in repo")
            continue
        paths = differing_paths(repo_rule, live_rule)
        print(f"  {label}: " + (f"differs: {', '.join(paths)}" if paths else "matches repo"))
    for ref in repo_by_ref:
        if ref not in live_refs:
            print(f"  {ref}: in repo, not live")


def report_phase(token, zone, phase, filename):
    """Reports one phase's ruleset; a failure is printed and does not stop later phases."""
    status, body = get(token, f"zones/{zone}/rulesets/phases/{phase}/entrypoint")
    print(f"{phase}: HTTP {status}")
    if status != 200:
        print(f"  errors: {error_codes(body)}")
        return
    live = body["result"]
    repo_rules = json.loads((DIRECTORY / filename).read_text())["rules"]
    live_rules = live.get("rules") or []
    print(f"  description present: {'yes' if live.get('description') else 'no'}")
    print(f"  rules: live {len(live_rules)}, repo {len(repo_rules)}")
    report_rules(live_rules, repo_rules)
    versions_status, versions_body = get(token, f"zones/{zone}/rulesets/{live['id']}/versions")
    if versions_status == 200:
        print(f"  versions: HTTP {versions_status}, {len(versions_body['result'])} kept")
    else:
        print(f"  versions: HTTP {versions_status}")


def main():
    """Entry point: each phase, then the tiered-cache setting."""
    token = os.environ["CLOUDFLARE_SECURITY_TOKEN"]
    zone = os.environ["CLOUDFLARE_ZONE_ID"]

    for phase, filename in RULESETS.items():
        report_phase(token, zone, phase, filename)

    status, body = get(token, f"zones/{zone}/cache/tiered_cache_smart_topology_enable")
    line = f"tiered cache: HTTP {status}"
    if status == 200:
        line += f", {body['result']['value']}"
    print(line)


if __name__ == "__main__":
    main()
