import { Home, MapPin } from "lucide-react";
import { Link, Outlet, useLocation, useMatches } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { cn } from "~/lib/utils";

// Define a type for the venue data
interface VenueData {
  meta?: {
    title?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export default function VenuesLayout() {
  const location = useLocation();
  const matches = useMatches();

  // Get the current path segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Find if we're on a venue detail page
  const isDetailPage = pathSegments.length > 1 && pathSegments[0] === "venues";

  // Get venue title from matches if available
  const venueData = isDetailPage
    ? (matches.find((match) => match.pathname.includes(`/venues/${pathSegments[1]}`))?.data as VenueData)
    : null;

  // Try to get the title from meta data or use the path segment
  const venueTitle = venueData?.meta?.title
    ? venueData.meta.title.replace(" | Biscuits Internet Project", "").trim()
    : pathSegments[1];

  // Format the venue name for display (convert slug to title case)
  const formatVenueName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayTitle = venueTitle || formatVenueName(pathSegments[1] || "");

  return (
    <div className="py-8">
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {isDetailPage ? (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/venues" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>Venues</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{displayTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>Venues</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Outlet />
    </div>
  );
}
