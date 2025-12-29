import {
  BookOpen,
  Building2,
  CalendarDays,
  Camera,
  Disc,
  Edit,
  Eye,
  FileText,
  Headphones,
  LogOut,
  Menu,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserDropdown } from "~/components/layout/user-dropdown";
import { SearchButton } from "~/components/search/search-button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useGlobalSearch } from "~/hooks/use-global-search";
import { useIsMobile } from "~/hooks/use-mobile";
import { useSession } from "~/hooks/use-session";

const navigation = [
  { name: "shows", href: "/shows", icon: Headphones },
  { name: "songs", href: "/songs", icon: Disc },
  { name: "venues", href: "/venues", icon: Building2 },
  { name: "resources", href: "/resources", icon: BookOpen },
  { name: "blog", href: "/blog", icon: FileText },
  { name: "top rated", href: "/shows/top-rated", icon: TrendingUp },
  { name: "tour dates", href: "/shows/tour-dates", icon: CalendarDays },
  { name: "photos", href: "/shows/with-photos", icon: Camera, mobileOnly: true },
];

export function Header() {
  const isMobile = useIsMobile();
  const { user, loading } = useSession();
  const { open: _openSearch } = useGlobalSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const username = user?.user_metadata?.username ?? user?.email?.split("@")[0];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm border-b border-border/10 overflow-hidden">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8 max-w-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center justify-center h-10 w-10 rounded-lg hover:opacity-80 transition-opacity"
              title="Home"
            >
              <img
                src="https://pub-6aa5e67069a14fc286677addbdd10c65.r2.dev/public/bip.png"
                alt="Biscuits Internet Project"
                className="h-8 w-8 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.slice(0, 6).map((item) => (
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

          {/* Search */}
          <div className="flex-1 min-w-0 max-w-lg mx-2 md:mx-4">
            <SearchButton className="w-full max-w-md mx-auto" showShortcut={!isMobile} />
          </div>

          {/* User Profile/Auth & Mobile Menu */}
          <div className="flex items-center space-x-2">
            {/* User Profile/Auth */}
            {!loading && (
              <div className="hidden sm:flex items-center space-x-2">
                {user ? (
                  <UserDropdown user={user} />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="glass-secondary hover:glass-content transition-all duration-200"
                  >
                    <Link to="/auth/login">Sign in</Link>
                  </Button>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-content-text-secondary hover:text-brand-primary"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">{mobileMenuOpen ? "Close" : "Open"} menu</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm block md:hidden">
          <div className="absolute top-4 right-4 z-[70]">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="text-content-text-secondary hover:text-brand-primary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 pt-14 space-y-1 h-full overflow-y-auto">
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

            {/* Mobile Auth & User Menu */}
            <div className="border-t border-border/10 pt-4 mt-4">
              {!loading &&
                (user ? (
                  <div className="space-y-1">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-4 py-3 rounded-md bg-brand-primary/5">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-brand-primary/20 text-brand-primary text-sm font-medium">
                          {username?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{username}</span>
                        <span className="text-xs text-content-text-secondary">{user.email}</span>
                      </div>
                    </div>

                    {/* User Menu Items */}
                    <Link
                      to={`/users/${username}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-content-text-secondary transition-all duration-200 hover:text-brand-primary hover:bg-hover-glass"
                    >
                      <Eye className="h-5 w-5 mr-3" />
                      View Profile
                    </Link>

                    <Link
                      to="/profile/edit"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-content-text-secondary transition-all duration-200 hover:text-brand-secondary hover:bg-hover-glass"
                    >
                      <Edit className="h-5 w-5 mr-3" />
                      Edit Profile
                    </Link>

                    <Link
                      to="/auth/logout"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center rounded-md px-4 py-3 text-base font-medium text-red-400 transition-all duration-200 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign out
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center rounded-md px-4 py-3 text-base font-medium text-content-text-secondary transition-all duration-200 hover:text-brand-primary hover:bg-hover-glass"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Sign in
                  </Link>
                ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
