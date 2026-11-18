"""Replace the zone's custom WAF, rate limiting and cache rules with the JSON files here.

Run: doppler run -p bip -c prd_hetzner -- python3 ops/cloudflare/apply.py [--baseline REVISION] [--force]
Needs CLOUDFLARE_SECURITY_TOKEN (Zone WAF edit) and CLOUDFLARE_ZONE_ID.

Each PUT replaces a phase's whole ruleset, so a change made only in the Cloudflare
dashboard (an emergency block or rate-limit change during a crawler incident, a rule
disabled by hand) would be reverted silently. Before changing anything, every phase is read
and each live rule is compared with a baseline: the rule file as it was at the revision
last applied. That revision is recorded in the live ruleset's description on every
successful PUT ("(applied <sha>)"); a phase whose description records no revision uses
--baseline instead (default HEAD). A revision missing from a shallow checkout
is fetched from origin.

A live rule is drift when its ref is in neither the baseline nor the new file (added in the
dashboard), or when it no longer matches its baseline version and also differs from the new
file's version (edited in the dashboard; matching the new file means the repo adopted the
edit). A live rule the baseline lacks but the new file carries is compared with the new
file's version alone. A baseline rule absent from the live rules that the new file still carries was
deleted in the dashboard. Comparing with the baseline rather than the new file lets a rule
be deleted from the JSON on purpose. A recorded revision that can't be fetched leaves that
phase's drift unchecked, which is reported the same way. Any drift exits non-zero without
applying; --force applies anyway after printing it, and records a revision later runs can
fetch.

The GitHub workflow cloudflare-rules.yml runs this on merge to main when ops/cloudflare
changes, and manually via workflow_dispatch (with a force input).
"""

import argparse
import json
import os
import pathlib
import re
import subprocess
import sys
import urllib.error
import urllib.request

API = "https://api.cloudflare.com/client/v4"
DIRECTORY = pathlib.Path(__file__).parent
RULESETS = {
    "http_request_firewall_custom": "waf-custom-rules.json",
    "http_ratelimit": "rate-limit-rules.json",
    "http_request_cache_settings": "cache-rules.json",
}

ADDED = "added in the dashboard"
EDITED = "edited in the dashboard"
DELETED = "deleted in the dashboard"

APPLIED_SUFFIX = re.compile(r"\s*\(applied ([0-9a-f]{40})\)\s*$")


class BaselineUnavailable(Exception):
    """The commit a phase was last applied at can't be fetched (an apply from a branch that
    was later deleted, say), so its drift can't be checked. Raised rather than exiting so
    --force can still apply and record a commit later runs can fetch."""


def matches(expected, actual):
    """Whether `actual` still carries everything `expected` set.

    Cloudflare adds fields to a rule it stores (id, version, last_updated, nested defaults),
    so extra keys in a dict are ignored at every depth. It may also return a list in its own
    order, so a list matches when it has the same length and each expected item matches a
    different actual item, in any order. Scalars must be equal.
    """
    if isinstance(expected, dict) and isinstance(actual, dict):
        return all(key in actual and matches(value, actual[key]) for key, value in expected.items())
    if isinstance(expected, list) and isinstance(actual, list):
        if len(expected) != len(actual):
            return False
        unclaimed = list(actual)
        for item in expected:
            partner = next((candidate for candidate in unclaimed if matches(item, candidate)), None)
            if partner is None:
                return False
            unclaimed.remove(partner)
        return True
    return expected == actual


def drifted_rules(live_rules, baseline_rules, repo_rules):
    """Live rules whose loss a whole-ruleset PUT of the repo file would make silent.

    The baseline is what the last apply pushed, so a live rule that still matches it is safe
    to replace or delete however the repo file changed it. A live edit that matches the repo
    version is already adopted. Returns (rule, reason) pairs; for a rule deleted in the
    dashboard the rule is the baseline version, since nothing live remains to show.
    """
    baseline_by_ref = {rule["ref"]: rule for rule in baseline_rules if "ref" in rule}
    repo_by_ref = {rule["ref"]: rule for rule in repo_rules if "ref" in rule}
    drifted = []
    for rule in live_rules:
        ref = rule.get("ref")
        if ref in baseline_by_ref:
            adopted = ref in repo_by_ref and matches(repo_by_ref[ref], rule)
            if not matches(baseline_by_ref[ref], rule) and not adopted:
                drifted.append((rule, EDITED))
        elif ref is None or ref not in repo_by_ref:
            drifted.append((rule, ADDED))
        elif not matches(repo_by_ref[ref], rule):
            # No baseline version to compare, so the repo version is the only reference;
            # the PUT overwrites a difference either way.
            drifted.append((rule, EDITED))
    live_refs = {rule.get("ref") for rule in live_rules}
    for ref, rule in baseline_by_ref.items():
        if ref not in live_refs and ref in repo_by_ref:
            drifted.append((rule, DELETED))
    return drifted


def applied_revision(description):
    """The commit recorded in a ruleset description by the last apply, or None if absent."""
    match = APPLIED_SUFFIX.search(description or "")
    return match.group(1) if match else None


def description_with_revision(description, revision):
    """The description to PUT: the file's own text plus the commit being applied.

    Cloudflare is the only state that survives between runs, so the applied commit rides in
    the ruleset description. Any earlier suffix is dropped so it never accumulates.
    """
    return f"{APPLIED_SUFFIX.sub('', description or '')} (applied {revision})".strip()


def load_ruleset(filename):
    """The checked-in ruleset body, shared by the apply and the rule-file tests."""
    return json.loads((DIRECTORY / filename).read_text())


def git(*arguments):
    """Runs git in the rules directory; callers branch on the exit code, not on error text."""
    return subprocess.run(["git", *arguments], cwd=DIRECTORY, capture_output=True, text=True)


def current_revision():
    """The commit whose rule files are about to be applied.

    Refuses when the rule files differ from that commit: the recorded revision would not
    contain what was applied, and every later run would report the difference as drift.
    """
    changed = git("status", "--porcelain", "--", *RULESETS.values())
    if changed.returncode != 0 or changed.stdout.strip():
        raise SystemExit(f"commit the rule file changes before applying:\n{changed.stdout}{changed.stderr}")
    result = git("rev-parse", "HEAD")
    if result.returncode != 0:
        raise SystemExit(f"git rev-parse HEAD failed: {result.stderr.strip()}")
    return result.stdout.strip()


def baseline_rules(revision, filename):
    """The rules `filename` held at `revision`; empty when the file did not exist then.

    A shallow checkout may lack the commit, so it is fetched from origin when missing. A
    commit that can't be fetched raises BaselineUnavailable rather than guessing an empty
    baseline, which would flag every live rule as dashboard-made.
    """
    if git("cat-file", "-e", f"{revision}^{{commit}}").returncode != 0:
        fetched = git("fetch", "--no-tags", "--depth=1", "origin", revision)
        if fetched.returncode != 0:
            raise BaselineUnavailable(f"baseline commit {revision} is unavailable: {fetched.stderr.strip()}")
    if git("cat-file", "-e", f"{revision}:./{filename}").returncode != 0:
        return []
    result = git("show", f"{revision}:./{filename}")
    if result.returncode != 0:
        raise SystemExit(f"git show {revision}:{filename} failed: {result.stderr.strip()}")
    return json.loads(result.stdout)["rules"]


def call(token, path, method, body=None, missing_ok=False):
    """One place for the auth headers and error handling every Cloudflare call shares.

    Returns the response's `result`, or None for a 404 when `missing_ok`. Any other HTTP
    error ends the run, naming the call so the log says which one failed.
    """
    request = urllib.request.Request(
        f"{API}/zones/{path}",
        json.dumps(body).encode() if body is not None else None,
        {"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method=method,
    )
    try:
        return json.load(urllib.request.urlopen(request))["result"]
    except urllib.error.HTTPError as error:
        if missing_ok and error.code == 404:
            return None
        raise SystemExit(f"{method} {path}: HTTP {error.code}: {error.read().decode()[:500]}")


def entrypoint(zone, phase):
    """The read and the replace of a phase must address the same ruleset."""
    return f"{zone}/rulesets/phases/{phase}/entrypoint"


def fetch_live_ruleset(token, zone, phase):
    """A phase with no ruleset yet answers 404, which means no rules to lose and no revision."""
    return call(token, entrypoint(zone, phase), "GET", missing_ok=True) or {}


def main():
    """Checks for dashboard drift against the baseline, then applies every phase and turns tiered cache on."""
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument(
        "--baseline",
        default="HEAD",
        help="git revision whose rule files were last applied, used for a phase whose live description records no applied revision (default HEAD)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="apply even if live rules were added, edited or deleted in the dashboard since the baseline (the repo files win)",
    )
    arguments = parser.parse_args()

    token = os.environ["CLOUDFLARE_SECURITY_TOKEN"]
    zone = os.environ["CLOUDFLARE_ZONE_ID"]
    bodies = {phase: load_ruleset(filename) for phase, filename in RULESETS.items()}
    revision = current_revision()

    # Checked across every phase before any PUT so a refusal never leaves a partial apply.
    drift = []
    for phase, body in bodies.items():
        live = fetch_live_ruleset(token, zone, phase)
        baseline_revision = applied_revision(live.get("description")) or arguments.baseline
        try:
            baseline = baseline_rules(baseline_revision, RULESETS[phase])
        except BaselineUnavailable as error:
            # Drift is unknowable here; reporting it keeps a normal run from applying blind,
            # while --force applies and records a commit the next run can fetch.
            drift.append(f"  {phase}  drift not checked: {error}")
            continue
        for rule, reason in drifted_rules(live.get("rules", []), baseline, body["rules"]):
            drift.append(
                f"  {phase}  ref={rule.get('ref')}  {reason}  {rule.get('action')}  {rule.get('description')}"
            )
    if drift and not arguments.force:
        sys.exit(
            "\n".join(
                [
                    "REFUSING: live rules changed in the dashboard since the baseline, or the baseline is unavailable",
                    *drift,
                    "Add or update them in the JSON files, or rerun with --force to overwrite them.",
                ]
            )
        )
    if drift:
        print("\n".join(["WARNING: overwriting", *drift]), file=sys.stderr)

    for phase, body in bodies.items():
        recorded = {**body, "description": description_with_revision(body.get("description"), revision)}
        for rule in call(token, entrypoint(zone, phase), "PUT", recorded)["rules"]:
            print(f"{rule['action']:18} enabled={rule['enabled']}  {rule['description']}")

    # Sends a cache miss through one Cloudflare location instead of each one that sees it, so
    # a crawl from IPs around the world doesn't fetch the same page once per location.
    tiered = call(token, f"{zone}/cache/tiered_cache_smart_topology_enable", "PATCH", {"value": "on"})
    print("tiered cache:", tiered["value"])


if __name__ == "__main__":
    main()
