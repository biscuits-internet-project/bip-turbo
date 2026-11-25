#!/usr/bin/env bash
# Fails unless the cloudflare-write environment has a required reviewer.
#
# GitHub creates an environment that a job names but that does not exist yet, with no
# protection rules, and the job then runs without asking anyone. The Cloudflare Rule
# Update workflow runs this first in both jobs: the dry run fails early, and the apply
# job, which a missing rule would let run unapproved, stops before it writes. A failed
# lookup stops the run with gh's own error. Needs GH_TOKEN and GITHUB_REPOSITORY.
set -euo pipefail

reviewers=$(gh api "repos/$GITHUB_REPOSITORY/environments/cloudflare-write" \
  --jq '[.protection_rules[]? | select(.type == "required_reviewers")] | length')
if [ "$reviewers" -lt 1 ]; then
  echo "The cloudflare-write environment has no required reviewer"
  exit 1
fi
