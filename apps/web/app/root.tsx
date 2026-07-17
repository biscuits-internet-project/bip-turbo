import type { Route } from ".react-router/types/app/+types/root";
import { type FeatureFlags, getFeatureFlags } from "@bip/core";
import { type DehydratedState, HydrationBoundary } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ConcertLights } from "~/components/concert-lights";
import { NotFound, ServerError } from "~/components/layout/errors";
import { HeaderLayout } from "~/components/layout/header-layout";
import { SearchProvider } from "~/components/search/search-provider";
import { SupabaseProvider } from "~/context/supabase-provider";
import { GlobalSearchProvider } from "~/hooks/use-global-search";
import { PreferencesProvider } from "~/hooks/use-preferences";
import { mergeDehydratedStates } from "~/lib/query-prefetch";
import type { SessionUser } from "~/lib/session-user";
import { toSessionUser } from "~/lib/session-user";
import { QueryProvider } from "~/providers/query-provider";
import { env } from "~/server/env";
import { getRequestUser } from "~/server/request-user";
import { services } from "~/server/services";
import stylesheet from "./styles.css?url";

export type RootPreferences = {
  /**
   * Tri-state, as stored: `null` means the viewer never chose, which
   * `usePreferences()` resolves to the app default. Kept unresolved here so
   * the default lives in exactly one place.
   */
  colorCodeRatings: boolean | null;
  showSetlistTimes: boolean | null;
};

export type RootData = {
  env: ClientSideEnv;
  sessionUser: SessionUser | null;
  /**
   * Feature flags resolved once for the whole app so client components
   * can read them at the point of use via `useFeatureFlags()` instead of having
   * individual flag values threaded down as props.
   */
  featureFlags: FeatureFlags;
  /**
   * Display preferences resolved once for the whole app so leaf components
   * can read them via `usePreferences()` instead of having the values threaded
   * through every intermediate component as props.
   */
  preferences: RootPreferences;
};

export type ClientSideEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_STORAGE_URL: string;
  BASE_URL: string;
};

export const links: Route.LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export async function loader({ request }: Route.LoaderArgs): Promise<RootData> {
  const clientEnv = {
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
    SUPABASE_STORAGE_URL: env.SUPABASE_STORAGE_URL,
    BASE_URL: env.BASE_URL,
  };

  // Seed useSession's initial state so user-specific UI paints on the
  // first frame instead of after supabase.auth.getSession() resolves.
  const user = await getRequestUser(request);
  const sessionUser = user ? toSessionUser(user) : null;

  // Resolve feature flags once here for the whole app; client components read them
  // via useFeatureFlags(). Segment-targeted flags match on username, which the
  // session user carries, so no extra DB lookup is needed.
  const featureFlags = await getFeatureFlags(
    sessionUser?.username ? { user: { username: sessionUser.username } } : undefined,
  );

  // Display preferences live on the user row, so unlike the flags above this
  // needs a lookup. Signed-out visitors skip it entirely and fall through to
  // the defaults in `usePreferences()`.
  const viewer = sessionUser?.email ? await services.users.findByEmail(sessionUser.email) : null;

  return {
    env: clientEnv,
    sessionUser,
    featureFlags,
    preferences: {
      colorCodeRatings: viewer?.colorCodeRatings ?? null,
      showSetlistTimes: viewer?.showSetlistTimes ?? null,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData() as RootData | undefined;
  const env = data?.env;

  const matches = useMatches();
  const dehydratedState = useMemo(
    () =>
      mergeDehydratedStates(
        matches.map((m) => (m.data as { dehydratedState?: DehydratedState } | undefined)?.dehydratedState),
      ),
    [matches],
  );

  return (
    <html lang="en" className="font-quicksand dark overflow-x-hidden">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen font-sans antialiased overflow-x-hidden">
        <ConcertLights />
        <SupabaseProvider env={env}>
          <QueryProvider>
            <HydrationBoundary state={dehydratedState}>
              <PreferencesProvider
                colorCodeRatings={data?.preferences?.colorCodeRatings}
                showSetlistTimes={data?.preferences?.showSetlistTimes}
              >
                <GlobalSearchProvider>
                  <SearchProvider>
                    <HeaderLayout>{children}</HeaderLayout>
                  </SearchProvider>
                </GlobalSearchProvider>
              </PreferencesProvider>
            </HydrationBoundary>
          </QueryProvider>
        </SupabaseProvider>
        <Toaster position="top-right" theme="dark" />
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
