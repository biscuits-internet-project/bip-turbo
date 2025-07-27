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
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { SearchButton } from "~/components/search/search-button";
import { useIsMobile } from "~/hooks/use-mobile";
import { useSession } from "~/hooks/use-session";
import { useGlobalSearch } from "~/hooks/use-global-search";
import { cn } from "~/lib/utils";

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

export function Header() {
  const isMobile = useIsMobile();
  const { user, loading } = useSession();
  const { open: openSearch } = useGlobalSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const username = user?.user_metadata?.username ?? user?.email?.split("@")[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b border-border/10">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Home Icon */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center justify-center h-10 w-10 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
            title="Home"
          >
            <Home className="h-5 w-5 text-foreground" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center rounded-md px-4 py-2 text-base font-medium text-muted-foreground transition-all duration-200 hover:text-accent-foreground hover:bg-accent/10"
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* Search */}
        <div className="flex-1 max-w-lg mx-4">
          <SearchButton 
            variant="outline" 
            size="sm" 
            className="w-full max-w-md mx-auto"
            showShortcut={!isMobile}
          />
        </div>

        {/* User Profile/Auth & Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* User Profile/Auth */}
          {!loading && (
            <div className="hidden sm:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block text-sm font-medium text-foreground">{username}</span>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-accent-foreground">
                    <Link to="/auth/logout">Sign out</Link>
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/login">Sign in</Link>
                </Button>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-muted-foreground hover:text-accent-foreground"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">{mobileMenuOpen ? "Close" : "Open"} menu</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/10">
            <nav className="p-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-all duration-200 hover:text-accent-foreground hover:bg-accent/10"
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Auth */}
              <div className="border-t border-border/10 pt-4 mt-4">
                {!loading && (
                  user ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 px-4 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                            {username?.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">{username}</span>
                      </div>
                      <Link
                        to="/auth/logout"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-all duration-200 hover:text-accent-foreground hover:bg-accent/10"
                      >
                        Sign out
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-muted-foreground transition-all duration-200 hover:text-accent-foreground hover:bg-accent/10"
                    >
                      Sign in
                    </Link>
                  )
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}