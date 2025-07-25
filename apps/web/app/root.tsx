import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "react-router-dom";
import { Toaster } from "sonner";
import { NotFound, ServerError } from "~/components/layout/errors";
import { RootLayout } from "~/components/layout/root-layout";
import { SearchProvider } from "~/components/search/search-provider";
import { SidebarProvider } from "~/components/ui/sidebar";
import { SupabaseProvider } from "~/context/supabase-provider";
import { env } from "~/server/env";
import stylesheet from "./styles.css?url";
import type { Route } from ".react-router/types/app/+types/root";

export type RootData = {
  env: ClientSideEnv;
};

export type ClientSideEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_STORAGE_URL: string;
  BASE_URL: string;
};

export const links: Route.LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export async function loader({ request }: LoaderFunctionArgs<RootData>) {
  const clientEnv = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
    SUPABASE_STORAGE_URL: env.SUPABASE_STORAGE_URL,
    BASE_URL: env.BASE_URL,
  };

  return {
    env: clientEnv,
  };
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  const { env } = useLoaderData() as RootData;

  return (
    <html lang="en" className="font-quicksand dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryClientProvider client={queryClient}>
          <SupabaseProvider env={env}>
            <SearchProvider>
              <ClientOnly>
                {(isDesktop) => (
                  <SidebarProvider defaultOpen={isDesktop}>
                    <RootLayout>{children}</RootLayout>
                  </SidebarProvider>
                )}
              </ClientOnly>
            </SearchProvider>
          </SupabaseProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster position="top-right" theme="dark" />
          <ScrollRestoration />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  );
}

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
      <SearchProvider>
        <SidebarProvider defaultOpen={true}>
          <RootLayout>{null}</RootLayout>
        </SidebarProvider>
      </SearchProvider>
    );
  }

  return children(isDesktop);
}

export default function App() {
  const { env } = useLoaderData() as RootData;
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
