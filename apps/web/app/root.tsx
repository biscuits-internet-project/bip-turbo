import { useEffect, useState } from "react";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { NotFound, ServerError } from "~/components/layout/errors";
import { RootLayout } from "~/components/layout/root-layout";
import { SidebarProvider } from "~/components/ui/sidebar";
import type { Route } from "./+types/root";
import stylesheet from "./styles.css?url";

export const links: Route.LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export const loader = async () => {};

// Client-only component to handle window-dependent logic
function ClientOnly({ children }: { children: (isDesktop: boolean) => React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkDesktop = () => window.innerWidth >= 768;
    setIsDesktop(checkDesktop());

    const handleResize = () => {
      setIsDesktop(checkDesktop());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMounted) {
    // Return a placeholder with the same structure during SSR
    return (
      <SidebarProvider defaultOpen={true}>
        <RootLayout>{null}</RootLayout>
      </SidebarProvider>
    );
  }

  return children(isDesktop);
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-quicksand dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientOnly>
          {(isDesktop) => (
            <SidebarProvider defaultOpen={isDesktop}>
              <RootLayout>{children}</RootLayout>
            </SidebarProvider>
          )}
        </ClientOnly>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  // Handle 500 errors
  if (isRouteErrorResponse(error) && error.status === 500) {
    return <ServerError />;
  }

  // Handle other errors as 500s as well
  if (error instanceof Error) {
    return <ServerError />;
  }

  // Fall back to default error component
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
      <h1>Something went wrong</h1>
      <p>{error?.toString?.() ?? "Unknown error"}</p>
    </div>
  );
}
