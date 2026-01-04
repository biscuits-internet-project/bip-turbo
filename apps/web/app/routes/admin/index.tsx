import { BookUser, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { adminLoader } from "~/lib/base-loaders";

export const loader = adminLoader(async () => {
  return { ok: true };
});

export function meta() {
  return [{ title: "Admin Dashboard" }];
}

interface AdminCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function AdminCard({ title, description, href, icon }: AdminCardProps) {
  return (
    <Link to={href}>
      <Card className="card-premium hover:border-brand-primary/50 transition-all duration-300 group h-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary group-hover:bg-brand-primary/30 transition-colors">
              {icon}
            </div>
            <CardTitle className="text-xl text-white group-hover:text-brand-primary transition-colors">
              {title}
            </CardTitle>
          </div>
          <CardDescription className="text-content-text-secondary">{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function AdminIndex() {
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
    } catch (_error) {
      setResult({ success: false, message: "Network error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminOnly>
      <div className="container mx-auto py-8">
        <h1 className="page-heading mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <AdminCard
            title="Authors"
            description="Manage song authors and composers"
            href="/admin/authors"
            icon={<BookUser className="h-5 w-5" />}
          />
        </div>

        <Card className="card-premium">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">Cache Management</CardTitle>
                <CardDescription className="text-content-text-secondary mt-1">
                  Purge the Cloudflare CDN cache for year listing pages
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>
      </div>
    </AdminOnly>
  );
}
