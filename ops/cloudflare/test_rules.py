"""Guards on the checked-in Cloudflare rules.

A cached signed-out render served to a signed-in visitor drops their session-dependent
page state (display preferences). The app's own preventSharedCachingForCredentialedRequests
only stops *storing* signed-in renders; it cannot stop Cloudflare from *serving* an
already-cached one, so every cache-enabling rule must skip requests carrying the auth cookie.
"""

import unittest

from apply import RULESETS, load_ruleset

AUTH_COOKIE_CLAUSE = 'not http.cookie contains "-auth-token"'


class RuleRefsTest(unittest.TestCase):
    """Refs are the identity the drift guard compares rules by."""

    def test_every_rule_has_a_unique_ref(self):
        """apply.py's drift guard matches live rules to repo rules by ref. A rule without
        one gets a ref Cloudflare invents, which the guard would then report as
        dashboard-only on every later run, blocking all applies."""
        for filename in RULESETS.values():
            rules = load_ruleset(filename)["rules"]
            refs = [rule.get("ref") for rule in rules]
            with self.subTest(file=filename):
                self.assertNotIn(None, refs)
                self.assertEqual(len(refs), len(set(refs)))


class CacheRulesTest(unittest.TestCase):
    """Cache rules must never serve a signed-out render to a signed-in visitor."""

    def test_every_caching_rule_skips_signed_in_visitors(self):
        """Fails for a rule that would hand a signed-in visitor the cached signed-out page."""
        rules = load_ruleset(RULESETS["http_request_cache_settings"])["rules"]
        caching_rules = [
            rule
            for rule in rules
            if rule["action"] == "set_cache_settings" and rule["action_parameters"].get("cache") is True
        ]
        self.assertTrue(caching_rules)
        for rule in caching_rules:
            with self.subTest(rule=rule["description"]):
                self.assertIn(AUTH_COOKIE_CLAUSE, rule["expression"])


if __name__ == "__main__":
    unittest.main()
