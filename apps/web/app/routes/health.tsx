import type { LoaderFunction } from "react-router";

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
