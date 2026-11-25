"""Tests for inspect_live.py using a fake Cloudflare zone; no network is touched."""

import unittest

import cloudflare_api
import inspect_live
from cloudflare_fakes import (
    MESSAGE_MARKER,
    TOKEN_MARKER,
    ZONE_MARKER,
    FakeResponse,
    http_error,
    request_path,
    run_against,
)

SECRET_MARKER = "LIVE-SECRET-MARKER"


class FakeZone:
    """Records every request and serves canned responses keyed by path."""

    def __init__(self, failing_phase=None):
        self.methods = []
        self.paths = []
        self.failing_phase = failing_phase

    def urlopen(self, request):
        self.methods.append(request.get_method())
        path = request_path(request)
        self.paths.append(path)
        if path.endswith("/entrypoint"):
            phase = path.split("/")[-2]
            if phase == self.failing_phase:
                raise http_error(request, 403)
            rules = cloudflare_api.load_repo_rules(cloudflare_api.RULESETS[phase])
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
    return run_against(zone.urlopen, inspect_live.main)[1]


class MainTest(unittest.TestCase):
    """A whole run against a fake zone: read-only, and safe to print into a public log."""

    def test_output_never_contains_secret_values(self):
        """Tokens, zone ids, descriptions and live expressions never reach stdout, but refs and field names do."""
        output = run_main(FakeZone())
        for marker in (SECRET_MARKER, TOKEN_MARKER, ZONE_MARKER, "DESCRIPTION-MARKER"):
            self.assertNotIn(marker, output)
        first_ref = cloudflare_api.load_repo_rules("waf-custom-rules.json")[0]["ref"]
        self.assertIn(f"  {first_ref}: differs:", output)
        self.assertIn("expression", output)
        self.assertIn("id (live only)", output)
        self.assertIn("  extra-live-rule: not in repo", output)
        self.assertIn("description present: yes", output)
        self.assertIn("tiered cache: HTTP 200", output)
        self.assertIn("versions: HTTP 200, 2 kept", output)

    def test_every_request_is_a_get(self):
        """The diagnostic is read-only: no request uses any method but GET, and each expected endpoint is hit."""
        zone = FakeZone()
        run_main(zone)
        self.assertEqual(set(zone.methods), {"GET"})
        for phase in cloudflare_api.RULESETS:
            self.assertIn(f"zones/{ZONE_MARKER}/rulesets/phases/{phase}/entrypoint", zone.paths)
            self.assertIn(f"zones/{ZONE_MARKER}/rulesets/ruleset-{phase}/versions", zone.paths)
        self.assertIn(f"zones/{ZONE_MARKER}/cache/tiered_cache_smart_topology_enable", zone.paths)

    def test_failing_phase_prints_codes_not_messages_and_continues(self):
        """A 403 on one phase prints its status and error codes only, and later phases still run."""
        output = run_main(FakeZone(failing_phase="http_ratelimit"))
        self.assertIn("http_ratelimit: HTTP 403", output)
        self.assertIn("errors: [10000]", output)
        self.assertNotIn(MESSAGE_MARKER, output)
        self.assertIn("http_request_cache_settings: HTTP 200", output)


if __name__ == "__main__":
    unittest.main()
