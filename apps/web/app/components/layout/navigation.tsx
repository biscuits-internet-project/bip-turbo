import { Calendar, FileText, MapPin, Music, Radio, Star, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "~/lib/utils";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Shows",
    href: "/shows",
    icon: Radio,
  },
  {
    title: "Top Rated",
    href: "/top-rated",
    icon: Star,
  },
  {
    title: "Songs",
    href: "/songs",
    icon: Music,
  },
  {
    title: "Venues",
    href: "/venues",
    icon: MapPin,
  },
  {
    title: "Tour Dates",
    href: "/tour-dates",
    icon: Calendar,
  },
  {
    title: "Resources",
    href: "/resources",
    icon: FileText,
  },
  {
    title: "Community",
    href: "/community",
    icon: Users,
  },
];

export function Navigation() {
  return (
    <nav className="flex flex-1 flex-col gap-1">
      {navigationItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-md font-medium",
              "text-content-text-secondary hover:bg-hover-glass hover:text-brand-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary",
              "transition-colors duration-200",
              "group/nav-item",
              isActive && "bg-brand-primary text-content-text-primary shadow-lg",
            )
          }
        >
          <item.icon className="h-4 w-4" />
          <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}
