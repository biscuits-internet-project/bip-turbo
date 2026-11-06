# Grafana Cloud

Stack: https://playfulfennec1443.grafana.net (personal account). The `alloy` Kamal accessory ships metrics and logs to it (`config/alloy/config.alloy`).

- `bip-overview.json`: the "bip: overview" dashboard (folder `bip`). Edit it in Grafana, then export it here with **Share → Export → Save to file**. To push this file instead:
  ```bash
  doppler run -p bip -c prd_hetzner --only-secrets GRAFANA_CLI_TOKEN -- sh -c '
    python3 -c "import json; print(json.dumps({\"dashboard\": json.load(open(\"ops/grafana/bip-overview.json\")), \"folderUid\": \"bip\", \"overwrite\": True}))" \
    | curl -s -H "Authorization: Bearer $GRAFANA_CLI_TOKEN" -H "Content-Type: application/json" -d @- https://playfulfennec1443.grafana.net/api/dashboards/db'
  ```

- `alert-rules.json`: the alert rules (folder `bip`, group `bip`, every 1 minute), sent by email through the `bip-email` contact point. The weekly auth backup rule stays paused until that backup has logged its first run.

- App errors: `App error burst` and `New app error` email when the app logs `level: error` lines. `New app error` looks back 7 days, so it runs in group `bip-slow` every 15 minutes. `handleError` in `entry.server.tsx` logs uncaught errors as `Uncaught server error: <type>: <message>`, so they group and alert the same way. Both the table and `New app error` group by log message and error type, not the full error text, because that text can contain IDs.

- Paging (Grafana IRM, configured in Grafana, not stored here): schedule `bip on-call` → escalation chain `bip-page` → integration and contact point `bip-page`, which also emails. The notification policy sends `Site returning errors`, `Postgres down`, `Monitoring agent stopped`, `Out-of-memory kill`, `Redis down` and `Site unreachable` to `bip-page`. Everything else is email only.

- Uptime (Synthetic Monitoring, configured in Grafana, not stored here): check `bip-healthcheck` requests `/healthcheck` every 2 minutes from Ohio and Oregon. It uses `/healthcheck` because Cloudflare can serve `/` from cache while the server is down.

Tokens in Doppler `bip/prd_hetzner`:
- `GRAFANA_CLOUD_TOKEN`: on the server, write-only (metrics, logs).
- `GRAFANA_CLI_TOKEN`: service account (Editor) for dashboards and alerts. Never on the server.
