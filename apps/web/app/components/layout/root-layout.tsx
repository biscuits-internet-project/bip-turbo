import type { User } from "@supabase/supabase-js";
import {
  BookOpen,
  Building2,
  CalendarDays,
  Disc,
  FileText,
  Headphones,
  Menu,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useRouteLoaderData } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useSidebar } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/lib/utils";
import type { RootData } from "~/root";

const navigation = [
  { name: "shows", href: "/shows", icon: Headphones },
  { name: "top rated", href: "/shows/top-rated", icon: TrendingUp },
  { name: "songs", href: "/songs", icon: Disc },
  { name: "venues", href: "/venues", icon: Building2 },
  { name: "tour dates", href: "/shows/tour-dates", icon: CalendarDays },
  { name: "resources", href: "/resources", icon: BookOpen },
  { name: "community", href: "/community", icon: UsersRound },
  { name: "blog", href: "/blog", icon: FileText },
];

export function RootLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const rootData = useRouteLoaderData("root") as RootData;

  const { SUPABASE_URL, SUPABASE_ANON_KEY } = rootData.env;
  const { user, loading } = useSession(SUPABASE_URL, SUPABASE_ANON_KEY);

  const username = user?.user_metadata?.username ?? user?.email?.split("@")[0];

  const { open, setOpen, toggleSidebar } = useSidebar();
  console.log("user", user);

  // Ensure sidebar is closed on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    } else {
      // Always keep sidebar open on desktop
      setOpen(true);
    }
  }, [isMobile, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - fixed on desktop, slide-in on mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-[#0a0a0a] transition-all duration-300 w-64",
          isMobile ? (open ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          "border-r border-border/40",
        )}
      >
        {/* Header */}
        <div className="border-b border-border/40 p-4">
          <Link to="/">
            <div className="flex flex-col items-start gap-1">
              <div className="text-lg font-bold text-primary">biscuits</div>
              <div className="text-sm text-muted-foreground">internet project</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4 transition-all" />
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/40 p-4 bg-[#0a0a0a]">
          <p className="mb-2 text-xs text-muted-foreground">Help keep the BIP ad-free</p>
          <Button variant="secondary" className="w-full">
            Donate
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
          onClick={toggleSidebar}
          onKeyDown={(e) => {
            if (e.key === "Escape") toggleSidebar();
          }}
          tabIndex={0}
          role="button"
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300", isMobile ? "pl-0" : "pl-64")}>
        <header className="sticky top-0 z-20 border-b border-border/40 bg-[#0a0a0a]">
          <div className="flex h-14 items-center gap-4 px-6">
            {isMobile && (
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            )}

            {/* User session indicator */}
            <div className="ml-auto flex items-center gap-4">
              {!loading &&
                (user ? (
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback className="bg-purple-900/50 text-xs">
                        {username?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{username}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/auth/logout">Logout</Link>
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/auth/login">Login</Link>
                  </Button>
                ))}
            </div>
          </div>
        </header>
        <main className="w-full px-10">{children}</main>
      </div>
    </div>
  );
}
