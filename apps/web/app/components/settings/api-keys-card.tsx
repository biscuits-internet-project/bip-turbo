import type { ApiKey } from "@bip/domain";
import { Copy, KeyRound, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ContactDialog } from "~/components/contact/contact-dialog";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { formInputClass } from "~/lib/form-styles";
import { RATE_LIMIT_DEFAULTS } from "~/lib/rate-limit-defaults";

/** Dates arrive from the loader as strings. */
type ListedKey = Omit<ApiKey, "createdAt" | "lastUsedAt"> & {
  createdAt: string | Date;
  lastUsedAt: string | Date | null;
};

function formatDay(value: string | Date | null): string {
  return value
    ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : "never";
}

async function callKeysApi(method: "POST" | "DELETE", body: object) {
  const response = await fetch("/api/api-keys", {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error ?? "Something went wrong");
  return payload;
}

export function ApiKeysCard({ initialKeys }: { initialKeys: ListedKey[] }) {
  const [keys, setKeys] = useState(initialKeys);
  const [name, setName] = useState("");
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      const { apiKey, secret } = await callKeysApi("POST", { name });
      setKeys((current) => [apiKey, ...current]);
      setNewSecret(secret);
      setName("");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const revoke = async (key: ListedKey) => {
    if (!window.confirm(`Revoke "${key.name}"? Anything using it will stop working.`)) return;
    try {
      await callKeysApi("DELETE", { id: key.id });
      setKeys((current) => current.filter((k) => k.id !== key.id));
      toast.success("Key revoked");
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const copySecret = async () => {
    if (!newSecret) return;
    await navigator.clipboard.writeText(newSecret);
    toast.success("Copied");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-content-text-primary">API keys</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2 text-sm text-content-text-secondary">
          <p>
            Use a key to call the <Link to="/mcp-info">MCP server</Link> or the API from a script. Send it as{" "}
            <code className="text-content-text-primary">Authorization: Bearer &lt;key&gt;</code>. A key acts as you, but
            can't do admin actions.
          </p>
          <p>
            Each key gets {RATE_LIMIT_DEFAULTS.mcp} MCP requests and {RATE_LIMIT_DEFAULTS.api} API requests a minute.
            Need more?{" "}
            <ContactDialog>
              <button type="button" className="underline hover:text-content-text-primary">
                Get in touch
              </button>
            </ContactDialog>{" "}
            and we'll raise your key's limit.
          </p>
        </div>

        {newSecret && (
          <div className="space-y-2 rounded-md border p-4" data-testid="new-api-key">
            <p className="text-sm font-medium text-content-text-primary">
              Copy your new key now. You won't be able to see it again.
            </p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={newSecret}
                className={`${formInputClass} font-mono text-xs`}
                aria-label="New API key"
              />
              <Button type="button" variant="outline" onClick={copySecret}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy key</span>
              </Button>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => setNewSecret(null)}>
              Done
            </Button>
          </div>
        )}

        {keys.length > 0 ? (
          <ul className="divide-y">
            {keys.map((key) => (
              <li key={key.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-content-text-primary">{key.name}</p>
                  <p className="text-xs text-content-text-tertiary">
                    <code>{key.prefix}…</code> · created {formatDay(key.createdAt)} · last used{" "}
                    {formatDay(key.lastUsedAt)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => revoke(key)}
                  aria-label={`Revoke ${key.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-content-text-tertiary">You don't have any API keys.</p>
        )}

        <form onSubmit={create} className="space-y-2">
          <Label htmlFor="api-key-name" className="text-content-text-primary font-medium">
            New key
          </Label>
          <div className="flex gap-2">
            <Input
              id="api-key-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="What it's for, e.g. setlist importer"
              maxLength={100}
              required
              className={formInputClass}
            />
            <Button type="submit" disabled={isCreating || !name.trim()}>
              <KeyRound className="h-4 w-4" />
              Create key
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
