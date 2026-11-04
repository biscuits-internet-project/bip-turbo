# Grafana Cloud

Stack: https://playfulfennec1443.grafana.net (personal account). The `alloy` Kamal accessory ships metrics and logs to it (`config/alloy/config.alloy`).

- `bip-overview.json`: the "bip: overview" dashboard (folder `bip`). Edit it in Grafana, then export it here with **Share → Export → Save to file**. To push this file instead:
  ```bash
  doppler run -p bip -c prd_hetzner --only-secrets GRAFANA_CLI_TOKEN -- sh -c '
    python3 -c "import json; print(json.dumps({\"dashboard\": json.load(open(\"ops/grafana/bip-overview.json\")), \"folderUid\": \"bip\", \"overwrite\": True}))" \
    | curl -s -H "Authorization: Bearer $GRAFANA_CLI_TOKEN" -H "Content-Type: application/json" -d @- https://playfulfennec1443.grafana.net/api/dashboards/db'
  ```

- `alert-rules.json`: the alert rules (folder `bip`, group `bip`, every 1 minute), sent by email through the `bip-email` contact point. The two "backup missing" rules start paused until each backup has logged its first run.

Tokens in Doppler `bip/prd_hetzner`:
- `GRAFANA_CLOUD_TOKEN`: on the server, write-only (metrics, logs).
- `GRAFANA_CLI_TOKEN`: service account (Editor) for dashboards and alerts. Never on the server.
