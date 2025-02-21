import { X } from "lucide-react";
import { Calendar, FileText, Home, Info, MapPin, Music } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "~/components/ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from "~/components/ui/sidebar";

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
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center px-4">
          <Link to="/" className="relative text-lg font-bold group md:text-2xl">
            <span className="bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent">
              <span className="hidden md:inline">biscuits internet project</span>
              <span className="md:hidden">bip</span>
            </span>
            <span className="absolute -top-1 -right-2 -rotate-12 transform rounded-md bg-purple-600 px-1.5 py-0.5 text-sm font-normal text-white">
              3.0
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-end">
            <SidebarTrigger />
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <Sidebar variant="sidebar" collapsible="offcanvas">
          <SidebarContent>
            <nav className="flex flex-col gap-2 p-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                  {item.subItems?.map((subItem) => (
                    <Link
                      key={subItem.name}
                      to={subItem.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 pl-10 text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                    >
                      <span>{subItem.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <p className="mb-2 text-xs text-gray-500">Help keep the BiP ad-free</p>
            <Button variant="secondary" className="w-full">
              Donate
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
