"""Guards on the checked-in Cloudflare rules.

A cached signed-out render served to a signed-in visitor drops their session-dependent
page state (display preferences). The app's own preventSharedCachingForCredentialedRequests
only stops *storing* signed-in renders; it cannot stop Cloudflare from *serving* an
already-cached one, so every cache-enabling rule must skip requests carrying the auth cookie.
"""

import unittest

from cloudflare_api import DIRECTORY, load_repo_rules

RULE_FILES = sorted(DIRECTORY.glob("*-rules.json"))
AUTH_COOKIE_CLAUSE = 'not http.cookie contains "-auth-token"'


class RuleRefsTest(unittest.TestCase):
    """Refs are the stable identity a single rule is found by in the live ruleset."""

    def test_every_rule_has_a_unique_ref(self):
        """A rule without a ref gets an id Cloudflare invents, so nothing in the repo can
        name it; a duplicated ref names two rules at once."""
        self.assertTrue(RULE_FILES)
        for path in RULE_FILES:
            refs = [rule.get("ref") for rule in load_repo_rules(path.name)]
            with self.subTest(file=path.name):
                self.assertNotIn(None, refs)
                self.assertEqual(len(refs), len(set(refs)))


class CacheRulesTest(unittest.TestCase):
    """Cache rules must never serve a signed-out render to a signed-in visitor."""

    def test_every_caching_rule_skips_signed_in_visitors(self):
        """Fails for a rule that would hand a signed-in visitor the cached signed-out page."""
        caching_rules = [
            rule
            for rule in load_repo_rules("cache-rules.json")
            if rule["action"] == "set_cache_settings" and rule["action_parameters"].get("cache") is True
        ]
        self.assertTrue(caching_rules)
        for rule in caching_rules:
            with self.subTest(rule=rule["description"]):
                self.assertIn(AUTH_COOKIE_CLAUSE, rule["expression"])


if __name__ == "__main__":
    unittest.main()
