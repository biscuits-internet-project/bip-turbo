import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return new Response(JSON.stringify({
    status: "healthy",
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
};
