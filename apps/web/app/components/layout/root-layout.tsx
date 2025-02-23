import { Calendar, FileText, MapPin, Music, Radio, Star, Users } from "lucide-react";
import { PanelLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";

const navigation = [
  { name: "shows", href: "/shows", icon: Radio },
  { name: "top rated", href: "/top-rated", icon: Star },
  { name: "songs", href: "/songs", icon: Music },
  { name: "venues", href: "/venues", icon: MapPin },
  { name: "tour dates", href: "/tour-dates", icon: Calendar },
  { name: "resources", href: "/resources", icon: FileText },
  { name: "community", href: "/community", icon: Users },
];

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 shrink-0 border-r border-border/40 bg-[#0a0a0a]">
        {/* Header */}
        <div className="border-b border-border/40 p-4">
          <div className="flex flex-col items-start gap-1">
            <div className="text-lg font-bold text-primary">biscuits</div>
            <div className="text-sm text-muted-foreground">internet project</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-lg font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border/40 p-4 bg-[#0a0a0a]">
          <p className="mb-2 text-xs text-muted-foreground">Help keep the BiP ad-free</p>
          <Button variant="secondary" className="w-full">
            Donate
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 pl-64">
        <header className="sticky top-0 z-30 border-b border-border/40 bg-[#0a0a0a]">
          <div className="flex h-14 items-center gap-4 px-4">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <PanelLeft />
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
        </header>
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
