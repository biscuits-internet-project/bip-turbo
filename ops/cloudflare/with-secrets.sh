#!/usr/bin/env bash
# Runs a command with the Cloudflare token and zone id from Doppler in its environment.
# Both are masked first, so GitHub Actions hides them if anything echoes them into this
# public repo's run logs. Used by every workflow step that talks to the live zone.
set -euo pipefail

CLOUDFLARE_SECURITY_TOKEN=$(doppler secrets get CLOUDFLARE_SECURITY_TOKEN --project bip --config prd_hetzner --plain)
CLOUDFLARE_ZONE_ID=$(doppler secrets get CLOUDFLARE_ZONE_ID --project bip --config prd_hetzner --plain)
if [ -z "$CLOUDFLARE_SECURITY_TOKEN" ] || [ -z "$CLOUDFLARE_ZONE_ID" ]; then
  echo "CLOUDFLARE_SECURITY_TOKEN or CLOUDFLARE_ZONE_ID is not readable from bip/prd_hetzner"
  exit 1
fi
echo "::add-mask::$CLOUDFLARE_SECURITY_TOKEN"
echo "::add-mask::$CLOUDFLARE_ZONE_ID"
export CLOUDFLARE_SECURITY_TOKEN CLOUDFLARE_ZONE_ID
exec "$@"
