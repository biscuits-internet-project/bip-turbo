import {
  BookOpen,
  Building2,
  CalendarDays,
  Disc,
  FileText,
  Headphones,
  Home,
  Menu,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useSidebar } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/lib/utils";

const navigation = [
  { name: "home", href: "/", icon: Home },
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

  const { user, loading } = useSession();

  const username = user?.user_metadata?.username ?? user?.email?.split("@")[0];

  const { open, setOpen, openMobile, setOpenMobile } = useSidebar();

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
    <div className="h-screen w-full overflow-hidden">
      {/* Sidebar - fixed on desktop, slide-in on mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-screen bg-background/95 backdrop-blur-sm transition-all duration-300 w-64 flex flex-col",
          isMobile ? (openMobile ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
          "border-r border-border/10",
        )}
      >
        {/* Navigation - scrollable area */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center rounded-md px-4 py-3 text-lg font-medium text-muted-foreground transition-all duration-200 hover:text-accent-foreground group"
              >
                <item.icon className="h-5 w-5 transition-all duration-200 group-hover:text-accent-foreground group-hover:drop-shadow-[0_0_6px_rgba(167,139,250,0.5)]" />
                <span className="ml-3 transition-all text-lg duration-200 group-hover:text-accent-foreground group-hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]">
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer - fixed at bottom */}
        <div className="border-t border-border/10 p-4 bg-background/95 backdrop-blur-sm">
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
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpenMobile(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpenMobile(false);
          }}
          tabIndex={0}
          role="button"
          aria-label="Close sidebar"
        />
      )}

      {/* Main Content */}
      <main className={cn("h-screen overflow-y-auto", isMobile ? "" : "ml-64")}>
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 right-4 z-50 h-14 w-14 bg-background/95 backdrop-blur-sm text-muted-foreground hover:text-accent-foreground hover:drop-shadow-[0_0_8px_rgba(167,139,250,0.5)] shadow-lg rounded-full border border-border/10"
            onClick={() => {
              setOpenMobile(!openMobile);
            }}
          >
            {openMobile ? (
              <X className="h-7 w-7 transition-all duration-200" />
            ) : (
              <Menu className="h-7 w-7 transition-all duration-200" />
            )}
            <span className="sr-only">{openMobile ? "Close" : "Open"} Sidebar</span>
          </Button>
        )}
        <div className="px-4 py-6 sm:px-10 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
