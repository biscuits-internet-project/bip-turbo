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

// Define a type for the blog post data
interface BlogPostData {
  blogPost?: {
    title: string;
  };
  [key: string]: unknown;
}

export default function BlogLayout() {
  const location = useLocation();
  const matches = useMatches();

  // Get the current path segments
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Find if we're on a blog post detail page
  const isDetailPage = pathSegments.length > 1 && pathSegments[0] === "blog";

  // Get blog post title from matches if available
  const blogPostData = isDetailPage
    ? (matches.find((match) => match.pathname.includes(`/blog/${pathSegments[1]}`))?.data as BlogPostData)
    : null;

  // Get the title directly from the blog post data
  const displayTitle = blogPostData?.blogPost?.title || "";

  // Format the post name for display (convert slug to title case)
  const formatPostName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formattedDisplayTitle = displayTitle || formatPostName(pathSegments[1] || "");

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
                    <Link to="/blog" className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>Blog</span>
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
                  <FileText className="h-3 w-3" />
                  <span>Blog</span>
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
