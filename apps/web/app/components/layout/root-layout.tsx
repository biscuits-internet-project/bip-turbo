import {
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  Disc,
  FileText,
  Headphones,
  MapPin,
  Menu,
  Music,
  PanelLeft,
  Radio,
  Star,
  TrendingUp,
  Users,
  UsersRound,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { useSidebar } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { cn } from "~/lib/utils";

const navigation = [
  { name: "shows", href: "/shows", icon: Headphones },
  { name: "top rated", href: "/top-rated", icon: TrendingUp },
  { name: "songs", href: "/songs", icon: Disc },
  { name: "venues", href: "/venues", icon: Building2 },
  { name: "tour dates", href: "/tour-dates", icon: CalendarDays },
  { name: "resources", href: "/resources", icon: BookOpen },
  { name: "community", href: "/community", icon: UsersRound },
  { name: "blog", href: "/blog", icon: FileText },
];

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { open, setOpen, toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  // Ensure sidebar is closed on mobile by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile, setOpen]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar - fixed on desktop, slide-in on mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-[#0a0a0a] transition-all duration-300",
          isMobile ? (open ? "w-64 translate-x-0" : "w-64 -translate-x-full") : open ? "w-64" : "w-16",
          "border-r border-border/40",
        )}
      >
        {/* Header */}
        <div className="border-b border-border/40 p-4">
          <div className={cn("flex flex-col items-start gap-1", !open && !isMobile && "items-center")}>
            <div className={cn("text-lg font-bold text-primary", !open && !isMobile && "text-center")}>
              {!open && !isMobile ? "B" : "biscuits"}
            </div>
            <div className={cn("text-sm text-muted-foreground", !open && !isMobile && "hidden")}>internet project</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                !open && !isMobile && "justify-center",
              )}
            >
              <item.icon className={cn("h-4 w-4 transition-all", !open && !isMobile && "h-8 w-8 hover:scale-110")} />
              <span className={cn("ml-3", !open && !isMobile && "hidden")}>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 border-t border-border/40 p-4 bg-[#0a0a0a]",
            !open && !isMobile && "flex flex-col items-center justify-center",
          )}
        >
          <p className={cn("mb-2 text-xs text-muted-foreground", !open && !isMobile && "hidden")}>
            Help keep the BIP ad-free
          </p>
          <Button variant="secondary" className={cn("w-full", !open && !isMobile && "w-auto px-2")}>
            {open || isMobile ? "Donate" : "$"}
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
      <div className={cn("flex-1 transition-all duration-300", isMobile ? "pl-0" : open ? "pl-64" : "pl-16")}>
        <header className="sticky top-0 z-20 border-b border-border/40 bg-[#0a0a0a]">
          <div className="flex h-14 items-center gap-4 px-6">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSidebar}>
              {isMobile ? (
                open ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
        </header>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
