import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/postcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    // Increase header size limit for development
    middlewareMode: false,
    hmr: {
      port: 24678,
    },
    // Allow cloudflare tunnel for CDN testing
    allowedHosts: [".trycloudflare.com"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
    },
    sourcemap: process.env.NODE_ENV === "development",
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    {
      name: "handle-well-known",
      configureServer(server) {
        server.middlewares.use("/.well-known", (_req, res, _next) => {
          // Silently return 404 for .well-known requests
          res.statusCode = 404;
          res.end();
        });
      },
    },
    {
      name: "increase-header-limit",
      configureServer(server) {
        // Increase Node.js server header size limit
        const originalListen = server.listen.bind(server);
        server.listen = (...args) => {
          if (server.httpServer) {
            (server.httpServer as { maxHeaderSize?: number }).maxHeaderSize = 32768;
          }
          return originalListen(...args);
        };
      },
    },
  ],
  ssr: {
    noExternal: ["use-elapsed-time"],
  },
  resolve:
    process.env.NODE_ENV === "development"
      ? {}
      : {
          alias: {
            "react-dom/server": "react-dom/server.node",
          },
        },
});
