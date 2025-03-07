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
          "fixed top-0 left-0 z-30 h-screen bg-background/95 backdrop-blur-sm transition-all duration-300 w-64",
          isMobile ? (open ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          "border-r border-border/10",
        )}
      >
        {/* Header */}
        <div className="border-b border-border/10 p-4">
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
              className="flex items-center rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-all duration-200 hover:text-accent-foreground group"
            >
              <item.icon className="h-5 w-5 transition-all duration-200 group-hover:text-accent-foreground group-hover:drop-shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
              <span className="ml-3 transition-all duration-200 group-hover:text-accent-foreground group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">
                {item.name}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/10 p-4 bg-background/95 backdrop-blur-sm">
          {!loading &&
            (user ? (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    {username?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{username}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-7 justify-start px-0 text-muted-foreground hover:text-accent-foreground"
                  >
                    <Link to="/auth/logout">Sign out</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-accent-foreground">
                <Link to="/auth/login">Sign in</Link>
              </Button>
            ))}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && open && (
        <div
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          tabIndex={0}
          role="button"
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <div className={cn("flex-1 transition-all duration-300", isMobile ? "pl-0" : "pl-64")}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-6 right-6 z-50 h-14 w-14 bg-background/95 backdrop-blur-sm text-muted-foreground hover:text-accent-foreground hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] shadow-lg rounded-full border border-border/10"
            onClick={() => setOpen(!open)}
          >
            {open ? (
              <X className="h-7 w-7 transition-all duration-200" />
            ) : (
              <Menu className="h-7 w-7 transition-all duration-200" />
            )}
            <span className="sr-only">{open ? "Close" : "Open"} Sidebar</span>
          </Button>
        )}
        <main className="w-full h-full px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
