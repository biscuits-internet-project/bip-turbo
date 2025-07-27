import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Handle known DevTools and bot requests silently
  const silentPaths = [
    '/.well-known/',
    '/robots.txt',
    '/favicon.ico',
    '/sitemap.xml',
    '/apple-touch-icon',
    '/android-chrome-',
    '/mstile-',
    '/browserconfig.xml',
    '/manifest.json'
  ];
  
  const shouldBeSilent = silentPaths.some(path => url.pathname.startsWith(path));
  
  if (shouldBeSilent) {
    // Return 404 without logging for known system requests
    throw new Response("Not Found", { status: 404 });
  }
  
  // Log unexpected 404s for debugging
  console.warn(`404: No route found for ${url.pathname}`);
  throw new Response("Not Found", { status: 404 });
}

export default function CatchAll() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-lg text-muted-foreground">Page not found</p>
      <a 
        href="/" 
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Go home
      </a>
    </div>
  );
}