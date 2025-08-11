import {
  BookOpen,
  Building2,
  CalendarDays,
  Disc,
  FileText,
  Headphones,
  Home,
  Mail,
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
import { UserDropdown } from "~/components/layout/user-dropdown";
import { useIsMobile } from "~/hooks/use-mobile";
import { useSession } from "~/hooks/use-session";
import { useGlobalSearch } from "~/hooks/use-global-search";
import { cn } from "~/lib/utils";

const navigation = [
  { name: "shows", href: "/shows", icon: Headphones },
  { name: "songs", href: "/songs", icon: Disc },
  { name: "venues", href: "/venues", icon: Building2 },
  { name: "community", href: "/community", icon: UsersRound },
  { name: "resources", href: "/resources", icon: BookOpen },
  { name: "blog", href: "/blog", icon: FileText },
  { name: "top rated", href: "/shows/top-rated", icon: TrendingUp },
  { name: "tour dates", href: "/shows/tour-dates", icon: CalendarDays },
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
        {/* Logo */}
        <div className="flex items-center">
          <Link 
            to="/" 
            className="flex items-center justify-center h-10 w-10 rounded-lg hover:opacity-80 transition-opacity"
            title="Home"
          >
            <img 
              src="/bip.png" 
              alt="Biscuits Internet Project" 
              className="h-8 w-8 object-contain"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.slice(0, 7).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center rounded-md px-4 py-2 text-lg font-semibold text-content-text-primary transition-all duration-200 hover:text-brand-primary hover:bg-hover-glass"
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
                <UserDropdown user={user} />
              ) : (
                <Button variant="ghost" size="sm" asChild className="glass-secondary hover:glass-content transition-all duration-200">
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
              className="text-content-text-secondary hover:text-brand-primary"
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
                  className="flex items-center rounded-md px-4 py-3 text-lg font-semibold text-content-text-primary transition-all duration-200 hover:text-brand-primary hover:bg-hover-glass"
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
                        className="flex items-center rounded-md px-4 py-3 text-base font-medium text-content-text-secondary transition-all duration-200 hover:text-brand-primary hover:bg-hover-glass"
                      >
                        Sign out
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-content-text-secondary transition-all duration-200 hover:text-brand-primary hover:bg-hover-glass"
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