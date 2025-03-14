import { FileText, Home } from "lucide-react";
import { Link, Outlet, useLocation, useMatches } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

// Define a type for the resource data
interface ResourceData {
  resource?: {
    title: string;
  };
  [key: string]: unknown;
}

export default function ResourcesLayout() {
  const location = useLocation();
  const matches = useMatches();

  // Get the current path segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Find if we're on a resource detail page
  const isDetailPage = pathSegments.length > 1 && pathSegments[0] === "resources";

  // Get resource title from matches if available
  const resourceData = isDetailPage
    ? (matches.find((match) => match.pathname.includes(`/resources/${pathSegments[1]}`))?.data as ResourceData)
    : null;

  // Get the title directly from the resource data
  const displayTitle = resourceData?.resource?.title || "";

  // Format the resource name for display (convert slug to title case)
  const formatResourceName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedDisplayTitle = displayTitle || formatResourceName(pathSegments[1] || "");

  return (
    <div className="">
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
                    <Link to="/resources">Resources</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{formattedDisplayTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>Resources</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Outlet />
    </div>
  );
}
