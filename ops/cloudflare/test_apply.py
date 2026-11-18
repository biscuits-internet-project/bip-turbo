"""Tests for the drift guard in apply.py, which keeps a whole-ruleset PUT from silently
discarding changes made in the Cloudflare dashboard while still letting the repo delete
rules on purpose."""

import os
import sys
import unittest
from unittest import mock

import apply
from apply import (
    ADDED,
    DELETED,
    EDITED,
    applied_revision,
    description_with_revision,
    drifted_rules,
    matches,
)


def rule(ref, expression="ip.src eq 1.1.1.1", **extra):
    """A minimal rule; tests vary only the fields their scenario is about."""
    return {"ref": ref, "expression": expression, "action": "block", **extra}


class DriftedRulesTest(unittest.TestCase):
    """Scenarios for which live rules a whole-ruleset PUT would silently lose."""

    def test_reports_live_rule_with_unknown_ref_as_added(self):
        """A ref in neither the baseline nor the repo was created in the dashboard."""
        live = [rule("known"), rule("emergency")]
        self.assertEqual(drifted_rules(live, [rule("known")], [rule("known")]), [(live[1], ADDED)])

    def test_reports_live_rule_without_ref_as_added(self):
        """A rule with no ref cannot be matched to any file, so it came from the dashboard."""
        live = [rule("known"), {"description": "no ref"}]
        self.assertEqual(drifted_rules(live, [rule("known")], [rule("known")]), [(live[1], ADDED)])

    def test_ignores_rule_deleted_from_repo_on_purpose(self):
        """An unchanged live rule that the new repo file drops is an intended deletion."""
        self.assertEqual(drifted_rules([rule("old")], [rule("old")], []), [])

    def test_ignores_rule_the_repo_changes(self):
        """An unchanged live rule the new repo file edits is an intended update."""
        repo = [rule("known", "ip.src eq 2.2.2.2")]
        self.assertEqual(drifted_rules([rule("known")], [rule("known")], repo), [])

    def test_reports_dashboard_edit_of_tracked_rule(self):
        """A live expression that differs from the baseline was edited in the dashboard."""
        live = [rule("known", "ip.src eq 9.9.9.9")]
        self.assertEqual(
            drifted_rules(live, [rule("known")], [rule("known")]), [(live[0], EDITED)]
        )

    def test_reports_dashboard_edit_even_when_repo_deletes_the_rule(self):
        """Deleting a rule must not discard a dashboard edit made to it first."""
        live = [rule("known", "ip.src eq 9.9.9.9")]
        self.assertEqual(drifted_rules(live, [rule("known")], []), [(live[0], EDITED)])

    def test_reports_dashboard_edit_even_when_repo_changes_the_rule(self):
        """A dashboard edit is drift regardless of what the new repo file does with the rule."""
        live = [rule("known", "ip.src eq 9.9.9.9")]
        repo = [rule("known", "ip.src eq 2.2.2.2")]
        self.assertEqual(drifted_rules(live, [rule("known")], repo), [(live[0], EDITED)])

    def test_reports_disabled_rule_as_edited(self):
        """Disabling a rule in an emergency is an edit even though the expression is intact."""
        baseline = [rule("known", enabled=True)]
        live = [rule("known", enabled=False)]
        self.assertEqual(drifted_rules(live, baseline, baseline), [(live[0], EDITED)])

    def test_ignores_fields_cloudflare_adds(self):
        """Server-side id, version, timestamps and nested defaults are not edits."""
        baseline = [rule("known", action_parameters={"response": {"status_code": 429}})]
        live = [
            rule(
                "known",
                id="abc",
                version="3",
                last_updated="2026-01-01T00:00:00Z",
                action_parameters={"response": {"status_code": 429, "content_type": "text/plain"}},
            )
        ]
        self.assertEqual(drifted_rules(live, baseline, baseline), [])

    def test_ignores_rule_new_in_repo_and_not_yet_live(self):
        """A rule only in the new repo file has nothing live to lose."""
        self.assertEqual(drifted_rules([], [], [rule("new")]), [])

    def test_ignores_live_rule_already_pushed_but_missing_from_baseline(self):
        """A rule a prior apply pushed, absent from the baseline but present in the repo, is tracked."""
        live = [rule("pushed")]
        self.assertEqual(drifted_rules(live, [], [rule("pushed")]), [])

    def test_reports_dashboard_edit_of_live_rule_missing_from_baseline(self):
        """With no baseline version to compare, a live rule that differs from the repo still
        counts as edited: the PUT would overwrite it either way."""
        live = [rule("pushed", "ip.src eq 9.9.9.9")]
        self.assertEqual(drifted_rules(live, [], [rule("pushed")]), [(live[0], EDITED)])

    def test_ignores_dashboard_edit_the_repo_has_adopted(self):
        """A live edit that matches the new repo version means the repo caught up with the dashboard."""
        live = [rule("known", "ip.src eq 9.9.9.9", id="abc")]
        repo = [rule("known", "ip.src eq 9.9.9.9")]
        self.assertEqual(drifted_rules(live, [rule("known")], repo), [])

    def test_reports_baseline_rule_deleted_in_dashboard(self):
        """A rule the repo still carries but the dashboard removed would be silently recreated."""
        baseline = [rule("known")]
        self.assertEqual(
            drifted_rules([], baseline, [rule("known")]), [(baseline[0], DELETED)]
        )

    def test_ignores_baseline_rule_missing_live_and_dropped_from_repo(self):
        """Both sides removed the rule, so the PUT loses nothing."""
        self.assertEqual(drifted_rules([], [rule("old")], []), [])

    def test_empty_live_set_reports_nothing(self):
        """A zone with no live rules and nothing applied before has nothing a PUT could discard."""
        self.assertEqual(drifted_rules([], [], [rule("known")]), [])


class MatchesTest(unittest.TestCase):
    """How strictly a live rule is compared with the version the repo expects."""

    def test_nested_dict_ignores_extra_actual_keys(self):
        """Extra keys at any depth in the actual value are Cloudflare defaults, not edits."""
        expected = {"a": {"b": 1}}
        self.assertTrue(matches(expected, {"a": {"b": 1, "c": 2}, "d": 3}))

    def test_nested_dict_detects_differing_value(self):
        """A changed nested value is a real difference."""
        self.assertFalse(matches({"a": {"b": 1}}, {"a": {"b": 2}}))

    def test_missing_expected_key_does_not_match(self):
        """A key the repo set but the live rule lacks is a difference."""
        self.assertFalse(matches({"a": 1}, {}))

    def test_list_ignores_item_order(self):
        """Cloudflare may return a list such as rate-limit characteristics in its own order."""
        self.assertTrue(matches({"a": ["ip.src", "cf.colo.id"]}, {"a": ["cf.colo.id", "ip.src"]}))

    def test_list_item_ignores_extra_keys(self):
        """Defaults Cloudflare adds inside each list item are not edits."""
        expected = {"a": [{"name": "x"}]}
        self.assertTrue(matches(expected, {"a": [{"name": "x", "operation": "set"}]}))

    def test_list_detects_extra_item(self):
        """An item the repo never set was added by someone."""
        self.assertFalse(matches({"a": [1, 2]}, {"a": [1, 2, 3]}))

    def test_list_detects_changed_item(self):
        """A changed item is a real difference even when the count is the same."""
        self.assertFalse(matches({"a": [1, 2]}, {"a": [1, 3]}))

    def test_list_counts_duplicates(self):
        """Each expected item needs its own live item, so [1, 1] is not satisfied by [1, 2]."""
        self.assertFalse(matches({"a": [1, 1]}, {"a": [1, 2]}))


SHA = "0123456789abcdef0123456789abcdef01234567"


class AppliedRevisionTest(unittest.TestCase):
    """The commit recorded in a ruleset description is the baseline for the next drift check."""

    def test_parses_revision_from_suffix(self):
        """The suffix written at apply time is what the next run reads back."""
        self.assertEqual(applied_revision(f"Cache rules (applied {SHA})"), SHA)

    def test_returns_none_without_suffix(self):
        """A ruleset whose description records no revision falls back to the argument."""
        self.assertIsNone(applied_revision("Cache rules"))

    def test_returns_none_for_missing_description(self):
        """A missing or empty description records nothing."""
        self.assertIsNone(applied_revision(None))
        self.assertIsNone(applied_revision(""))

    def test_description_written_for_a_put_round_trips(self):
        """What is recorded is exactly what is parsed back, whatever the file's own description."""
        for description in ("Cache rules", ""):
            with self.subTest(description=description):
                self.assertEqual(applied_revision(description_with_revision(description, SHA)), SHA)

    def test_rerecording_replaces_the_previous_suffix(self):
        """Applying twice leaves one suffix, not a growing chain."""
        once = description_with_revision("Cache rules", SHA)
        newer = "f" * 40
        self.assertEqual(
            description_with_revision(once, newer), f"Cache rules (applied {newer})"
        )


APPLYING = "a" * 40
PREVIOUSLY_APPLIED = "b" * 40


def run_main(arguments, baseline_rules, puts):
    """Runs main() against a fake zone whose live rules equal the repo files and whose
    descriptions record PREVIOUSLY_APPLIED, with git stubbed out. Appends the description of
    every PUT, in order, to `puts`, which the caller owns so it stays readable when main()
    exits."""
    bodies = {phase: apply.load_ruleset(filename) for phase, filename in apply.RULESETS.items()}

    def fake_call(token, path, method, body=None, missing_ok=False):
        phase = path.split("/")[-2]
        if method == "GET":
            return {"description": f"live (applied {PREVIOUSLY_APPLIED})", "rules": bodies[phase]["rules"]}
        if method == "PUT":
            puts.append(body["description"])
            return {"rules": []}
        return {"value": "on"}

    with (
        mock.patch.object(sys, "argv", ["apply.py", *arguments]),
        mock.patch.dict(os.environ, {"CLOUDFLARE_SECURITY_TOKEN": "token", "CLOUDFLARE_ZONE_ID": "zone"}),
        mock.patch.object(apply, "call", fake_call),
        mock.patch.object(apply, "current_revision", return_value=APPLYING),
        mock.patch.object(apply, "baseline_rules", side_effect=baseline_rules),
        mock.patch("builtins.print"),
    ):
        apply.main()


def repo_baseline(revision, filename):
    """A baseline identical to the repo files, so the fake zone shows no drift."""
    return apply.load_ruleset(filename)["rules"]


def unavailable_baseline(revision, filename):
    """The recorded commit can't be fetched, as after an apply from a deleted branch."""
    raise apply.BaselineUnavailable(f"baseline commit {revision} is unavailable")


class MainWiringTest(unittest.TestCase):
    """main() threads two different revisions: the one each phase was last applied at (to
    read its baseline) and the one being applied now (to record). Mixing them up records a
    stale commit, so the next run compares against the wrong files."""

    def test_every_put_records_the_commit_being_applied(self):
        """With a different commit recorded on the live rulesets, each PUT still records
        the commit being applied, not the baseline it was compared against."""
        puts = []
        run_main([], repo_baseline, puts)
        self.assertEqual(len(puts), len(apply.RULESETS))
        for description in puts:
            self.assertEqual(applied_revision(description), APPLYING)


class UnavailableBaselineTest(unittest.TestCase):
    """A recorded commit that can no longer be fetched must not lock the workflow for good:
    a normal run refuses, and a forced run applies and records a reachable commit."""

    def test_refuses_without_force_and_applies_nothing(self):
        """Without the baseline, drift can't be checked, so a normal run stops before any PUT."""
        puts = []
        with self.assertRaises(SystemExit) as refusal:
            run_main([], unavailable_baseline, puts)
        self.assertEqual(puts, [])
        self.assertIn("--force", str(refusal.exception.code))

    def test_force_applies_and_records_the_current_commit(self):
        """A forced run skips the unknowable drift check and records the commit being
        applied, which the next run can fetch."""
        puts = []
        run_main(["--force"], unavailable_baseline, puts)
        self.assertEqual(len(puts), len(apply.RULESETS))
        for description in puts:
            self.assertEqual(applied_revision(description), APPLYING)


if __name__ == "__main__":
    unittest.main()
