import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse } from "react-router-dom";
import type { Route } from "./+types/root";
import { RootLayout } from "./components/layout/root-layout";
import "./styles.css";
import { SidebarProvider } from "./components/ui/sidebar";

export const beforeLoad = ({ request }: { request: Request }) => {
  console.log("⚡️ beforeLoad:", request.method, new URL(request.url).pathname);
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  console.log("⚡️ root loader:", request.method, new URL(request.url).pathname);
  return {};
};

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
        <SidebarProvider defaultOpen>
          <RootLayout>
            <Outlet />
          </RootLayout>
        </SidebarProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-muted-foreground mb-4">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto bg-muted rounded-lg">
          <code className="text-sm">{stack}</code>
        </pre>
      )}
    </main>
  );
}

export const links = () => [];
