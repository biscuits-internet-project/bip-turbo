"""Tests for inspect_live.py using a fake Cloudflare zone; no network is touched."""

import contextlib
import io
import json
import os
import unittest
import urllib.error
from unittest import mock

import inspect_live

TOKEN_MARKER = "TOKEN-MARKER"
ZONE_MARKER = "ZONE-MARKER"
SECRET_MARKER = "LIVE-SECRET-MARKER"


class FakeResponse:
    """Minimal stand-in for the object urlopen returns, supporting json.load."""

    def __init__(self, payload):
        self.payload = json.dumps(payload).encode()

    def read(self, *arguments):
        return self.payload

    def __enter__(self):
        return self

    def __exit__(self, *arguments):
        return False


def repo_rules(filename):
    """Loads the rules the repo ships for a ruleset file."""
    return json.loads((inspect_live.DIRECTORY / filename).read_text())["rules"]


class FakeZone:
    """Records every request and serves canned responses keyed by path."""

    def __init__(self, failing_phase=None):
        self.methods = []
        self.paths = []
        self.failing_phase = failing_phase

    def urlopen(self, request):
        self.methods.append(request.get_method())
        path = request.full_url[len(inspect_live.API) + 1 :]
        self.paths.append(path)
        if path == "user/tokens/verify":
            return FakeResponse({"result": {"status": "active"}})
        if path.endswith("/entrypoint"):
            phase = path.split("/")[-2]
            if phase == self.failing_phase:
                body = json.dumps({"errors": [{"code": 10000, "message": "MESSAGE-MARKER"}]}).encode()
                raise urllib.error.HTTPError(request.full_url, 403, "Forbidden", {}, io.BytesIO(body))
            filename = inspect_live.RULESETS[phase]
            rules = repo_rules(filename)
            live_rules = [dict(rule, id="rule-id", version="3") for rule in rules[:1]]
            if live_rules:
                live_rules[0]["expression"] = SECRET_MARKER
                live_rules[0]["description"] = SECRET_MARKER
            live_rules.append({"ref": "extra-live-rule", "expression": SECRET_MARKER})
            return FakeResponse(
                {"result": {"id": f"ruleset-{phase}", "description": "DESCRIPTION-MARKER", "rules": live_rules}}
            )
        if path.endswith("/versions"):
            return FakeResponse({"result": [{}, {}]})
        if path.endswith("tiered_cache_smart_topology_enable"):
            return FakeResponse({"result": {"value": "on"}})
        raise AssertionError(f"unexpected path {path}")


def run_main(zone):
    """Runs main against a fake zone and returns what it printed."""
    environment = {"CLOUDFLARE_SECURITY_TOKEN": TOKEN_MARKER, "CLOUDFLARE_ZONE_ID": ZONE_MARKER}
    buffer = io.StringIO()
    with mock.patch.dict(os.environ, environment), mock.patch.object(
        inspect_live.urllib.request, "urlopen", zone.urlopen
    ), contextlib.redirect_stdout(buffer):
        inspect_live.main()
    return buffer.getvalue()


class DifferingPathsTest(unittest.TestCase):
    """How a live rule is compared with the repo version: names in both directions, never values."""

    def test_identical_rules_have_no_differences(self):
        """Equal rules produce an empty list, which is what 'matches repo' means."""
        rule = {"ref": "a", "action_parameters": {"mode": "x"}, "tags": ["b", "a"]}
        self.assertEqual(inspect_live.differing_paths(rule, json.loads(json.dumps(rule))), [])

    def test_extra_live_key_is_reported_as_live_only(self):
        """Fields Cloudflare adds (id, version) surface by name as live only."""
        self.assertEqual(
            inspect_live.differing_paths({"ref": "a"}, {"ref": "a", "id": "secret"}),
            ["id (live only)"],
        )

    def test_missing_live_key_is_reported_as_repo_only(self):
        """A field the repo sets but Cloudflare lacks surfaces as repo only."""
        self.assertEqual(
            inspect_live.differing_paths({"ref": "a", "enabled": True}, {"ref": "a"}),
            ["enabled (repo only)"],
        )

    def test_nested_change_uses_dotted_path(self):
        """Dict values recurse so the exact nested field is named, without its value."""
        repo = {"action_parameters": {"edge_ttl": {"mode": "override"}}}
        live = {"action_parameters": {"edge_ttl": {"mode": "respect"}}}
        self.assertEqual(
            inspect_live.differing_paths(repo, live), ["action_parameters.edge_ttl.mode"]
        )

    def test_list_order_is_not_a_difference(self):
        """Cloudflare may reorder lists; order alone must not count as drift."""
        self.assertEqual(inspect_live.differing_paths({"items": [1, 2, 3]}, {"items": [3, 1, 2]}), [])

    def test_list_content_difference_reports_list_path(self):
        """Lists are not recursed; the list's own path is reported."""
        self.assertEqual(inspect_live.differing_paths({"items": [1, 2]}, {"items": [1, 9]}), ["items"])


class MainTest(unittest.TestCase):
    """A whole run against a fake zone: read-only, and safe to print into a public log."""

    def test_output_never_contains_secret_values(self):
        """Tokens, zone ids, descriptions and live expressions never reach stdout, but refs and field names do."""
        output = run_main(FakeZone())
        for marker in (SECRET_MARKER, TOKEN_MARKER, ZONE_MARKER, "DESCRIPTION-MARKER"):
            self.assertNotIn(marker, output)
        first_ref = repo_rules("waf-custom-rules.json")[0]["ref"]
        self.assertIn(f"  {first_ref}: differs:", output)
        self.assertIn("expression", output)
        self.assertIn("id (live only)", output)
        self.assertIn("  extra-live-rule: not in repo", output)
        self.assertIn("description present: yes", output)
        self.assertIn("token status: active", output)
        self.assertIn("tiered cache: HTTP 200", output)
        self.assertIn("versions: HTTP 200, 2 kept", output)

    def test_every_request_is_a_get(self):
        """The diagnostic is read-only: no request uses any method but GET, and each expected endpoint is hit."""
        zone = FakeZone()
        run_main(zone)
        self.assertEqual(set(zone.methods), {"GET"})
        self.assertIn("user/tokens/verify", zone.paths)
        for phase in inspect_live.RULESETS:
            self.assertIn(f"zones/{ZONE_MARKER}/rulesets/phases/{phase}/entrypoint", zone.paths)
            self.assertIn(f"zones/{ZONE_MARKER}/rulesets/ruleset-{phase}/versions", zone.paths)
        self.assertIn(f"zones/{ZONE_MARKER}/cache/tiered_cache_smart_topology_enable", zone.paths)

    def test_failing_phase_prints_codes_not_messages_and_continues(self):
        """A 403 on one phase prints its status and error codes only, and later phases still run."""
        output = run_main(FakeZone(failing_phase="http_ratelimit"))
        self.assertIn("http_ratelimit: HTTP 403", output)
        self.assertIn("errors: [10000]", output)
        self.assertNotIn("MESSAGE-MARKER", output)
        self.assertIn("http_request_cache_settings: HTTP 200", output)


if __name__ == "__main__":
    unittest.main()
