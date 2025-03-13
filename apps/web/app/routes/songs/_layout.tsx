import { Home, Music } from "lucide-react";
import { Link, Outlet, useLocation, useMatches } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

// Define a type for the song data
interface SongData {
  song?: {
    title: string;
  };
  [key: string]: unknown;
}

export default function SongsLayout() {
  const location = useLocation();
  const matches = useMatches();

  // Get the current path segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Find if we're on a song detail page
  const isDetailPage = pathSegments.length > 1 && pathSegments[0] === "songs";

  // Get song title from matches if available
  const songData = isDetailPage
    ? (matches.find((match) => match.pathname.includes(`/songs/${pathSegments[1]}`))?.data as SongData)
    : null;

  // Get the title directly from the song data
  const displayTitle = songData?.song?.title || "";

  // Format the song name for display (convert slug to title case)
  const formatSongName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedDisplayTitle = displayTitle || formatSongName(pathSegments[1] || "");

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
                    <Link to="/songs" className="flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      <span>Songs</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{formattedDisplayTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-1">
                  <Music className="h-3 w-3" />
                  <span>Songs</span>
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
