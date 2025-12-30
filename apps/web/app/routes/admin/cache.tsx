import { RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { adminLoader } from "~/lib/base-loaders";

export const loader = adminLoader(async () => {
  return { timestamp: new Date().toISOString() };
});

export function meta() {
  return [{ title: "Cache Management | Admin" }];
}

export default function AdminCache() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handlePurgeCache = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/cache", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ action: "purge" }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message || "Cache purged successfully" });
      } else {
        setResult({ success: false, message: data.error || "Failed to purge cache" });
      }
    } catch (error) {
      setResult({ success: false, message: "Network error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="page-heading mb-8">Cache Management</h1>

      <div className="card-premium p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white mb-2">Cloudflare CDN Cache</h2>
          <p className="text-content-text-secondary text-sm mb-4">
            Purge the Cloudflare CDN cache for year listing pages. Use this when content isn't updating as expected.
          </p>

          <Button onClick={handlePurgeCache} disabled={isLoading} variant="destructive" className="gap-2">
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Purging...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Purge CDN Cache
              </>
            )}
          </Button>
        </div>

        {result && (
          <div
            className={`p-4 rounded-lg ${
              result.success
                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {result.message}
          </div>
        )}
      </div>
    </div>
  );
}
