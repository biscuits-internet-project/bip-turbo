import type { LucideIcon } from "lucide-react";
import { BookUser, Calendar, Clock, Flame, History, ListMusic, Plus } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminOnly } from "~/components/admin/admin-only";
import { LinkButton } from "~/components/ui/link-button";
import { PageHeader } from "~/components/ui/page-header";
import { TabNav } from "~/components/ui/tab-nav";

interface Tab {
  label: string;
  path: string;
  icon: LucideIcon;
  iconClassName?: string;
}

const TABS: Tab[] = [
  { label: "All Songs", path: "/songs", icon: ListMusic },
  { label: "Last 10 Shows", path: "/songs/recent", icon: Clock },
  { label: "This Year", path: "/songs/this-year", icon: Calendar },
  { label: "Jam Charts", path: "/songs/jam-charts", icon: Flame, iconClassName: "text-flame-jam" },
  { label: "All-Timers", path: "/songs/all-timers", icon: Flame, iconClassName: "text-flame-all-timer" },
  { label: "Histories", path: "/songs/histories", icon: History },
];

const TABBED_PATHS = new Set(TABS.map((tab) => tab.path));

export default function SongsLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const showTabs = TABBED_PATHS.has(pathname);

  return (
    <div className="py-1">
      {showTabs && (
        <>
          <PageHeader
            title="SONGS"
            actions={
              <AdminOnly>
                <LinkButton to="/admin/authors" icon={BookUser} intent="secondary" iconOnlyOnMobile>
                  Manage authors
                </LinkButton>
                <LinkButton to="/songs/new" icon={Plus} iconOnlyOnMobile>
                  Create Song
                </LinkButton>
              </AdminOnly>
            }
          />
          <TabNav
            className="mb-6"
            ariaLabel="Songs view"
            value={pathname}
            onValueChange={navigate}
            items={TABS.map((tab) => ({
              value: tab.path,
              label: tab.label,
              href: tab.path,
              icon: tab.icon,
              iconClassName: tab.iconClassName,
            }))}
          />
        </>
      )}

      <Outlet />
    </div>
  );
}
