"""Cloudflare API calls and rule comparison shared by inspect_live.py and update_rule.py.

Why it exists: both scripts read the same rulesets, compare them with the repo files
the same way and must keep the same rules about what reaches a public run log
(statuses, error codes and field names, never values). inspect_live.py imports only
`get`, so its read-only promise is visible from its import line.
"""

import json
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

# Fields Cloudflare adds to every live rule, which the repo files never set.
SERVER_FIELDS = ("id", "version", "last_updated")


def load_repo_rules(filename):
    """The rules a repo ruleset file defines."""
    return json.loads((DIRECTORY / filename).read_text())["rules"]


def send(token, method, path, body=None):
    """One Cloudflare API call.

    Returns (status, parsed JSON or None); status is None when the network fails.
    """
    headers = {"Authorization": f"Bearer {token}"}
    data = None
    if body is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(body).encode()
    request = urllib.request.Request(f"{API}/{path}", data=data, headers=headers, method=method)
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


def get(token, path):
    """A read, for callers that must never write."""
    return send(token, "GET", path)


def without_server_fields(live_rule):
    """The live rule as the repo would write it, for comparing with differing_paths."""
    return {key: value for key, value in live_rule.items() if key not in SERVER_FIELDS}


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
