import type { LucideIcon } from "lucide-react";
import { Flame, History, ListMusic, Plus } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface Tab {
  label: string;
  path: string;
  icon: LucideIcon;
  iconClassName?: string;
}

const TABS: Tab[] = [
  { label: "All Songs", path: "/songs", icon: ListMusic },
  { label: "All-Timers", path: "/songs/all-timers", icon: Flame, iconClassName: "text-orange-500" },
  { label: "Histories", path: "/songs/histories", icon: History },
];

const TABBED_PATHS = new Set(TABS.map((tab) => tab.path));

export default function SongsLayout() {
  const { pathname } = useLocation();
  const showTabs = TABBED_PATHS.has(pathname);

  return (
    <div className="py-8">
      <div className="relative">
        <h1 className="page-heading">SONGS</h1>
        <div className="absolute top-0 right-0 flex items-center gap-3">
          <AdminOnly>
            <Button asChild className="btn-primary">
              <Link to="/songs/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Song
              </Link>
            </Button>
          </AdminOnly>
        </div>
      </div>

      {showTabs && (
        <div className="w-full flex justify-start border-b border-glass-border/30 mb-6">
          {TABS.map((tab) => {
            const isActive = pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium",
                  isActive
                    ? "border-b-2 border-brand-primary text-content-text-primary"
                    : "text-content-text-tertiary hover:text-content-text-secondary",
                )}
              >
                <Icon className={cn("h-4 w-4", tab.iconClassName)} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      )}

      <Outlet />
    </div>
  );
}
