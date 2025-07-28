import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/postcss";

export default defineConfig({
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
      plugins: [
        tailwindcss,
      ],
    },
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(),
    {
      name: 'handle-well-known',
      configureServer(server) {
        server.middlewares.use('/.well-known', (req, res, next) => {
          // Silently return 404 for .well-known requests
          res.statusCode = 404;
          res.end();
        });
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
