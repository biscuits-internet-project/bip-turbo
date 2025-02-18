import { Menu, X } from "lucide-react";
import { Calendar, FileText, Home, Info, MapPin, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

const navigation = [
  { name: "home", href: "/", icon: Home },
  { name: "shows", href: "/shows", icon: Music, subItems: [{ name: "top rated", href: "/shows/top-rated" }] },
  { name: "songs", href: "/songs", icon: Music },
  { name: "venues", href: "/venues", icon: MapPin },
  { name: "tour dates", href: "/tour-dates", icon: Calendar },
  { name: "resources", href: "/resources", icon: Info },
  { name: "a clamouring sound", href: "/blog", icon: FileText },
];

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen bg-background">
        {/* Header with logo */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
          <div className="h-full flex items-center justify-between px-4">
            <Link to="/" className="text-lg md:text-2xl font-bold relative group">
              <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
                <span className="hidden md:inline">biscuits internet project</span>
                <span className="md:hidden">bip</span>
              </span>
              <span className="absolute -top-1 -right-2 text-sm font-normal bg-purple-600 text-white px-1.5 py-0.5 rounded-md transform -rotate-12">3.0</span>
            </Link>
            <SidebarTrigger />
          </div>
        </header>

        <div className="pt-16 flex">
          {/* Sidebar */}
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-background border-r border-border">
            <SidebarContent>
              <nav className="p-4 space-y-1">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Link to={item.href} className="flex items-center px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent/50">
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Link>
                    {item.subItems?.map((subItem) => (
                      <Link key={subItem.name} to={subItem.href} className="flex items-center pl-9 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-accent/50">
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>
            </SidebarContent>
            <SidebarFooter className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Help keep the BiP ad-free</p>
              <Button variant="secondary" className="w-full">
                Donate
              </Button>
            </SidebarFooter>
          </div>

          {/* Main content */}
          <main className="flex-1 ml-64">
            <div className="max-w-[1200px] mx-auto p-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
