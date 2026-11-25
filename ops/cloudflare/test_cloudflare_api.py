"""Tests for the rule comparison in cloudflare_api.py."""

import json
import unittest

from cloudflare_api import differing_paths


class DifferingPathsTest(unittest.TestCase):
    """How a live rule is compared with the repo version: names in both directions, never values."""

    def test_identical_rules_have_no_differences(self):
        """Equal rules produce an empty list, which is what 'matches repo' means."""
        rule = {"ref": "a", "action_parameters": {"mode": "x"}, "tags": ["b", "a"]}
        self.assertEqual(differing_paths(rule, json.loads(json.dumps(rule))), [])

    def test_extra_live_key_is_reported_as_live_only(self):
        """Fields Cloudflare adds (id, version) surface by name as live only."""
        self.assertEqual(
            differing_paths({"ref": "a"}, {"ref": "a", "id": "secret"}),
            ["id (live only)"],
        )

    def test_missing_live_key_is_reported_as_repo_only(self):
        """A field the repo sets but Cloudflare lacks surfaces as repo only."""
        self.assertEqual(
            differing_paths({"ref": "a", "enabled": True}, {"ref": "a"}),
            ["enabled (repo only)"],
        )

    def test_nested_change_uses_dotted_path(self):
        """Dict values recurse so the exact nested field is named, without its value."""
        repo = {"action_parameters": {"edge_ttl": {"mode": "override"}}}
        live = {"action_parameters": {"edge_ttl": {"mode": "respect"}}}
        self.assertEqual(
            differing_paths(repo, live), ["action_parameters.edge_ttl.mode"]
        )

    def test_list_order_is_not_a_difference(self):
        """Cloudflare may reorder lists; order alone must not count as drift."""
        self.assertEqual(differing_paths({"items": [1, 2, 3]}, {"items": [3, 1, 2]}), [])

    def test_list_content_difference_reports_list_path(self):
        """Lists are not recursed; the list's own path is reported."""
        self.assertEqual(differing_paths({"items": [1, 2]}, {"items": [1, 9]}), ["items"])


if __name__ == "__main__":
    unittest.main()
