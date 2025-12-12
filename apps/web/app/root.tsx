import type { Route } from ".react-router/types/app/+types/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ConcertLights } from "~/components/concert-lights";
import { NotFound, ServerError } from "~/components/layout/errors";
import { HeaderLayout } from "~/components/layout/header-layout";
import { SearchProvider } from "~/components/search/search-provider";
import { SupabaseProvider } from "~/context/supabase-provider";
import { GlobalSearchProvider } from "~/hooks/use-global-search";
import { env } from "~/server/env";
import stylesheet from "./styles.css?url";

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: make a new query client if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

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

export async function loader(): Promise<RootData> {
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

export function Layout({ children }: { children: React.ReactNode }) {
  // Use singleton pattern: server creates fresh client per request,
  // browser reuses same client instance across renders
  const queryClient = getQueryClient();

  const data = useLoaderData() as RootData | undefined;
  const env = data?.env;

  return (
    <html lang="en" className="font-quicksand dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ConcertLights />
        <QueryClientProvider client={queryClient}>
          <SupabaseProvider env={env}>
            <GlobalSearchProvider>
              <SearchProvider>
                <HeaderLayout>{children}</HeaderLayout>
              </SearchProvider>
            </GlobalSearchProvider>
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
