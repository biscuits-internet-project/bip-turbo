import { type AdminApiKey, apiKeyLimitsSchema } from "@bip/domain";
import { data, useFetcher } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { PageHeader } from "~/components/ui/page-header";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { adminAction, adminLoader } from "~/lib/base-loaders";
import { formInputClass } from "~/lib/form-styles";
import { RATE_LIMIT_DEFAULTS } from "~/lib/rate-limit-defaults";
import { services } from "~/server/services";

interface LoaderData {
  keys: AdminApiKey[];
}

export const meta = () => [{ title: "API keys | Admin" }];

export const loader = adminLoader(async (): Promise<LoaderData> => ({ keys: await services.apiKeys.listAllActive() }));

/** An empty box means "back to the default". */
function parseLimit(value: FormDataEntryValue | null): number | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? null : Number(text);
}

export const action = adminAction(async ({ request }) => {
  const form = await request.formData();
  const id = form.get("id");
  const parsed = apiKeyLimitsSchema.safeParse({
    mcpLimitPerMinute: parseLimit(form.get("mcpLimitPerMinute")),
    apiLimitPerMinute: parseLimit(form.get("apiLimitPerMinute")),
  });
  if (typeof id !== "string" || !parsed.success) {
    return data({ error: "Limits must be whole numbers above zero, or blank for the default" }, { status: 400 });
  }
  if (!(await services.apiKeys.setLimits(id, parsed.data))) return data({ error: "Key not found" }, { status: 404 });
  return { saved: id };
});

function formatDay(value: string | Date | null): string {
  return value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "never";
}

function KeyLimitsRow({ apiKey }: { apiKey: AdminApiKey }) {
  const fetcher = useFetcher<{ error?: string; saved?: string }>();
  const saving = fetcher.state !== "idle";

  return (
    <li className="flex flex-col gap-3 py-4 md:flex-row md:items-end md:justify-between" data-key-id={apiKey.id}>
      <div className="min-w-0">
        <p className="font-medium text-content-text-primary">{apiKey.name}</p>
        <p className="text-xs text-content-text-tertiary">
          {apiKey.ownerUsername ?? "unknown user"} · <code>{apiKey.prefix}…</code> · last used{" "}
          {formatDay(apiKey.lastUsedAt)}
        </p>
        {fetcher.data?.error && <p className="text-xs text-red-400">{fetcher.data.error}</p>}
        {fetcher.data?.saved && !saving && <p className="text-xs text-green-400">Saved</p>}
      </div>
      <fetcher.Form method="post" className="flex items-end gap-2">
        <input type="hidden" name="id" value={apiKey.id} />
        <label className="space-y-1 text-xs text-content-text-tertiary">
          <span>MCP / min</span>
          <Input
            name="mcpLimitPerMinute"
            type="number"
            min={1}
            defaultValue={apiKey.mcpLimitPerMinute ?? ""}
            placeholder={String(RATE_LIMIT_DEFAULTS.mcp)}
            aria-label={`MCP limit for ${apiKey.name}`}
            className={`${formInputClass} w-28`}
          />
        </label>
        <label className="space-y-1 text-xs text-content-text-tertiary">
          <span>API / min</span>
          <Input
            name="apiLimitPerMinute"
            type="number"
            min={1}
            defaultValue={apiKey.apiLimitPerMinute ?? ""}
            placeholder={String(RATE_LIMIT_DEFAULTS.api)}
            aria-label={`API limit for ${apiKey.name}`}
            className={`${formInputClass} w-28`}
          />
        </label>
        <Button type="submit" variant="outline" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </fetcher.Form>
    </li>
  );
}

export default function AdminApiKeys() {
  const { keys } = useSerializedLoaderData<LoaderData>();

  return (
    <AdminOnly>
      <div className="container mx-auto max-w-4xl py-6 space-y-6">
        <PageHeader title="API KEYS" backLink={{ to: "/admin", label: "Admin" }} />
        <p className="text-sm text-content-text-secondary">
          Raise a key's per-minute limit when someone asks for more. Leave a box blank for the default (
          {RATE_LIMIT_DEFAULTS.mcp} MCP, {RATE_LIMIT_DEFAULTS.api} API).
        </p>
        <Card>
          <CardContent>
            {keys.length > 0 ? (
              <ul className="divide-y">
                {keys.map((apiKey) => (
                  <KeyLimitsRow key={apiKey.id} apiKey={apiKey} />
                ))}
              </ul>
            ) : (
              <p className="py-6 text-sm text-content-text-tertiary">No one has created an API key yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
