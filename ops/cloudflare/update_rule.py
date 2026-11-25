"""Sets one live Cloudflare rule's expression to the repo's, and changes nothing else.

Why it exists: apply.py replaces whole rulesets, which would delete the rules that
exist only in the live zone. This updates a single rule, found by its ref, and only
when the live rule already matches the repo in every field but the expression. Any
other difference means the rule was changed outside the repo, so it refuses.

Without --apply it only reads, and prints the old and new expression and the ruleset
version to roll back to. With --apply it repeats those checks, sends one PATCH for that
rule, and reads the ruleset back to confirm the rule now matches the repo and that the
rule order and every other rule are as they were.

It prints a rule's expression only for refs the repo defines, whose content is public
here already. It never prints the token, the zone, ruleset or rule ids, descriptions,
or any other live rule, because run logs on this public repo are world-readable.

Rollback: revert the rule in the repo and run this again, or restore the printed
ruleset version from Cloudflare's version history.

Run: from the Cloudflare Rule Update workflow. Needs CLOUDFLARE_SECURITY_TOKEN and
CLOUDFLARE_ZONE_ID. Exits 0 when the rule matches the repo (or would, in a dry run)
and 1 when it refuses or fails.
"""

import argparse
import os

from cloudflare_api import (
    RULESETS,
    differing_paths,
    error_codes,
    get,
    load_repo_rules,
    send,
    without_server_fields,
)


def find_repo_rule(ref):
    """Returns (phase, rule) for the repo rule with this ref, or None."""
    for phase, filename in RULESETS.items():
        for rule in load_repo_rules(filename):
            if rule["ref"] == ref:
                return phase, rule
    return None


def other_rule_changes(rules_before, rules_after, ref):
    """What the update changed beyond the target rule, or None when nothing else changed.

    Rule order is precedence (a later cache rule overrides an earlier one), and the
    docs do not promise a PATCH without `position` keeps it, so both the order and
    every other rule are checked. Rules are named by ref only, never by content.
    """
    if [rule.get("ref") for rule in rules_before] != [rule.get("ref") for rule in rules_after]:
        return "rule order changed"
    changed = [
        str(before.get("ref"))
        for before, after in zip(rules_before, rules_after)
        if before.get("ref") != ref and without_server_fields(before) != without_server_fields(after)
    ]
    return f"other rules changed: {', '.join(changed)}" if changed else None


def compare_live_rule(token, zone, phase, repo_rule):
    """Reads the live rule with the repo rule's ref and compares them.

    Returns (ruleset, live rule, differing field names), or None after printing why
    the read failed. Used before the update and again to verify it.
    """
    status, body = get(token, f"zones/{zone}/rulesets/phases/{phase}/entrypoint")
    if status != 200:
        print(f"read: HTTP {status}, errors: {error_codes(body)}")
        return None
    ruleset = body["result"]
    matches = [rule for rule in ruleset.get("rules") or [] if rule.get("ref") == repo_rule["ref"]]
    if len(matches) != 1:
        print(f"refusing: found {len(matches)} live rules with this ref, expected 1")
        return None
    return ruleset, matches[0], differing_paths(repo_rule, without_server_fields(matches[0]))


def main(arguments=None):
    """Checks the live rule against the repo, then updates its expression when asked to."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--ref", required=True, help="ref of the rule, as in ops/cloudflare/*-rules.json")
    parser.add_argument("--apply", action="store_true", help="send the update; without it, only read")
    options = parser.parse_args(arguments)

    found = find_repo_rule(options.ref)
    if found is None:
        print(f"refusing: {options.ref} is not in the repo's rule files")
        return 1
    phase, repo_rule = found
    token = os.environ["CLOUDFLARE_SECURITY_TOKEN"]
    zone = os.environ["CLOUDFLARE_ZONE_ID"]
    print(f"rule {options.ref} in {phase}")

    compared = compare_live_rule(token, zone, phase, repo_rule)
    if compared is None:
        return 1
    ruleset, live_rule, paths = compared
    print(f"ruleset version before: {ruleset['version']}")
    if not paths:
        print("live rule matches repo: nothing to do")
        return 0
    if paths != ["expression"]:
        print(f"refusing: live rule differs beyond the expression: {', '.join(paths)}")
        return 1
    print(f"old expression: {live_rule['expression']}")
    print(f"new expression: {repo_rule['expression']}")
    if not options.apply:
        print("dry run: nothing changed")
        return 0

    updated = without_server_fields(live_rule)
    updated["expression"] = repo_rule["expression"]
    status, body = send(
        token, "PATCH", f"zones/{zone}/rulesets/{ruleset['id']}/rules/{live_rule['id']}", updated
    )
    if status != 200:
        print(f"update: HTTP {status}, errors: {error_codes(body)}")
        return 1
    print(f"update: HTTP {status}")

    compared = compare_live_rule(token, zone, phase, repo_rule)
    if compared is None:
        return 1
    ruleset_after, _, paths = compared
    if paths:
        print(f"read-back differs: {', '.join(paths)}")
        return 1
    problem = other_rule_changes(ruleset.get("rules") or [], ruleset_after.get("rules") or [], options.ref)
    if problem:
        print(f"read-back: {problem}")
        return 1
    print(f"verified: live rule matches repo, ruleset version after: {ruleset_after['version']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
