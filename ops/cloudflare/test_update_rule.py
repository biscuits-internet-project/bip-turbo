"""Tests for update_rule.py using a fake Cloudflare zone; no network is touched."""

import copy
import json
import unittest

import cloudflare_api
import update_rule
from cloudflare_fakes import (
    MESSAGE_MARKER,
    TOKEN_MARKER,
    ZONE_MARKER,
    FakeResponse,
    http_error,
    request_path,
    run_against,
)

RULESET_ID = "RULESET-ID-MARKER"
RULE_ID = "RULE-ID-MARKER"
PRIVATE_MARKER = "PRIVATE-RULE-MARKER"
OLD_EXPRESSION = "(http.host eq \"discobiscuits.net\" and OLD-EXPRESSION)"
CACHE_PHASE = "http_request_cache_settings"


YEAR_RULE = cloudflare_api.load_repo_rules(cloudflare_api.RULESETS[CACHE_PHASE])[0]
YEAR_REF = YEAR_RULE["ref"]
ENTRYPOINT = f"zones/{ZONE_MARKER}/rulesets/phases/{CACHE_PHASE}/entrypoint"
RULE_PATH = f"zones/{ZONE_MARKER}/rulesets/{RULESET_ID}/rules/{RULE_ID}"


def live_year_rule(**changes):
    """The year rule as Cloudflare returns it: repo fields plus server fields, with any changes applied."""
    rule = dict(copy.deepcopy(YEAR_RULE), id=RULE_ID, version="2", last_updated="2026-01-01T00:00:00Z")
    rule.update(changes)
    return rule


class FakeZone:
    """A live cache ruleset that records requests and applies a PATCH to its stored rule."""

    def __init__(self, rules, read_status=200, patch_status=200, patch_applies=True, patch_side_effect=None):
        self.rules = rules
        self.read_status = read_status
        self.version = "7"
        self.patch_status = patch_status
        self.patch_applies = patch_applies
        self.patch_side_effect = patch_side_effect
        self.requests = []

    def ruleset(self):
        return {
            "id": RULESET_ID,
            "version": self.version,
            "description": "DESCRIPTION-MARKER",
            "rules": copy.deepcopy(self.rules),
        }

    def urlopen(self, request):
        method = request.get_method()
        path = request_path(request)
        body = json.loads(request.data) if request.data else None
        self.requests.append((method, path, body))
        if method == "GET" and path == ENTRYPOINT:
            if self.read_status != 200:
                raise http_error(request, self.read_status)
            return FakeResponse({"result": self.ruleset()})
        if method == "PATCH" and path == RULE_PATH:
            if self.patch_status != 200:
                raise http_error(request, self.patch_status)
            if self.patch_applies:
                index = next(i for i, rule in enumerate(self.rules) if rule["id"] == RULE_ID)
                self.rules[index] = dict(body, id=RULE_ID, version="3", last_updated="2026-02-02T00:00:00Z")
                self.version = "8"
            if self.patch_side_effect:
                self.patch_side_effect(self.rules)
            return FakeResponse({"result": self.ruleset()})
        raise AssertionError(f"unexpected {method} {path}")

    def methods(self):
        return [method for method, _, _ in self.requests]

    def patches(self):
        return [(path, body) for method, path, body in self.requests if method == "PATCH"]


def private_rule():
    """A rule that exists only live; its content must never reach the log."""
    return {"id": "other", "ref": "private-live-rule", "expression": PRIVATE_MARKER, "description": PRIVATE_MARKER}


def run(zone, *arguments):
    """Runs main against a fake zone and returns (exit code, printed output)."""
    return run_against(zone.urlopen, update_rule.main, list(arguments))


class GuardTest(unittest.TestCase):
    """When the script refuses or has nothing to do, it sends no write."""

    def test_ref_not_in_repo_is_refused_without_any_request(self):
        """Only rules the repo defines can be updated, so a live-only rule can never be touched or printed."""
        zone = FakeZone([private_rule()])
        code, output = run(zone, "--ref", "private-live-rule", "--apply")
        self.assertEqual(code, 1)
        self.assertIn("not in the repo", output)
        self.assertEqual(zone.requests, [])

    def test_matching_live_rule_needs_nothing(self):
        """A live rule that differs only in the fields Cloudflare adds is already up to date."""
        zone = FakeZone([live_year_rule()])
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 0)
        self.assertIn("nothing to do", output)
        self.assertEqual(zone.patches(), [])

    def test_difference_beyond_expression_is_refused(self):
        """Any live difference other than the expression means someone changed the rule elsewhere; stop and name the fields."""
        changed = live_year_rule(expression=OLD_EXPRESSION, enabled=False)
        zone = FakeZone([changed])
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("refusing", output)
        self.assertIn("enabled", output)
        self.assertEqual(zone.patches(), [])

    def test_missing_live_rule_is_refused(self):
        """A repo rule with no live counterpart is not created by this script."""
        zone = FakeZone([private_rule()])
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("found 0 live rules", output)
        self.assertEqual(zone.patches(), [])

    def test_duplicate_live_ref_is_refused(self):
        """Two live rules with one ref make the target ambiguous."""
        zone = FakeZone([live_year_rule(expression=OLD_EXPRESSION), live_year_rule(id="second")])
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("found 2 live rules", output)
        self.assertEqual(zone.patches(), [])

    def test_failed_read_is_refused_with_codes_only(self):
        """A failed read stops the run and prints Cloudflare's error codes, not its messages."""
        zone = FakeZone([live_year_rule(expression=OLD_EXPRESSION)], read_status=403)
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("HTTP 403", output)
        self.assertIn("[10000]", output)
        self.assertNotIn(MESSAGE_MARKER, output)


class DryRunTest(unittest.TestCase):
    """The dry run shows exactly what would change and changes nothing."""

    def test_dry_run_prints_both_expressions_and_only_reads(self):
        """The reviewer sees the old and new expression and the rollback version before approving."""
        zone = FakeZone([live_year_rule(expression=OLD_EXPRESSION), private_rule()])
        code, output = run(zone, "--ref", YEAR_REF)
        self.assertEqual(code, 0)
        self.assertEqual(set(zone.methods()), {"GET"})
        self.assertIn(f"old expression: {OLD_EXPRESSION}", output)
        self.assertIn(f"new expression: {YEAR_RULE['expression']}", output)
        self.assertIn("ruleset version before: 7", output)
        self.assertIn("dry run: nothing changed", output)


class ApplyTest(unittest.TestCase):
    """Applying sends one PATCH for one rule, then reads the rule back."""

    def test_apply_patches_only_the_expression_and_verifies(self):
        """The PATCH body is the live rule minus server fields with the repo expression, and the read-back must match."""
        live = live_year_rule(expression=OLD_EXPRESSION)
        zone = FakeZone([live, private_rule()])
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 0)
        expected_body = {key: value for key, value in live.items() if key not in ("id", "version", "last_updated")}
        expected_body["expression"] = YEAR_RULE["expression"]
        self.assertEqual(zone.patches(), [(RULE_PATH, expected_body)])
        self.assertEqual(zone.methods(), ["GET", "PATCH", "GET"])
        self.assertIn("verified: live rule matches repo", output)
        self.assertIn("ruleset version after: 8", output)
        self.assertEqual(zone.rules[1], private_rule())

    def test_rejected_patch_prints_codes_and_fails(self):
        """A refused write (for example a token without edit permission) fails with codes only and claims no change."""
        zone = FakeZone([live_year_rule(expression=OLD_EXPRESSION)], patch_status=403)
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("update: HTTP 403", output)
        self.assertIn("[10000]", output)
        self.assertNotIn(MESSAGE_MARKER, output)
        self.assertNotIn("verified", output)

    def test_read_back_mismatch_fails(self):
        """If the live rule still differs after the PATCH, the run fails instead of reporting success."""
        zone = FakeZone([live_year_rule(expression=OLD_EXPRESSION)], patch_applies=False)
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("read-back differs: expression", output)
        self.assertNotIn("verified", output)

    def test_moved_rule_fails_read_back(self):
        """A PATCH that changes the rule's place in the list changes precedence, so it is not a verified update."""
        zone = FakeZone(
            [live_year_rule(expression=OLD_EXPRESSION), private_rule()],
            patch_side_effect=lambda rules: rules.append(rules.pop(0)),
        )
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("read-back: rule order changed", output)
        self.assertNotIn("verified", output)

    def test_other_rule_changed_fails_read_back(self):
        """Any other live rule that differs after the PATCH fails the run and is named by ref, never by content."""
        zone = FakeZone(
            [live_year_rule(expression=OLD_EXPRESSION), private_rule()],
            patch_side_effect=lambda rules: rules[1].update(enabled=False),
        )
        code, output = run(zone, "--ref", YEAR_REF, "--apply")
        self.assertEqual(code, 1)
        self.assertIn("read-back: other rules changed: private-live-rule", output)
        self.assertNotIn(PRIVATE_MARKER, output)
        self.assertNotIn("verified", output)

    def test_output_never_contains_secrets_ids_or_other_rules(self):
        """Token, zone id, ruleset and rule ids, descriptions and other live rules never reach the public log."""
        zone = FakeZone([live_year_rule(expression=OLD_EXPRESSION), private_rule()])
        _, output = run(zone, "--ref", YEAR_REF, "--apply")
        for marker in (TOKEN_MARKER, ZONE_MARKER, RULESET_ID, RULE_ID, PRIVATE_MARKER, "DESCRIPTION-MARKER"):
            self.assertNotIn(marker, output)


if __name__ == "__main__":
    unittest.main()
