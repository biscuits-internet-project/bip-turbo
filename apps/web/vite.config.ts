import path from "node:path";
import { reactRouter } from "@react-router/dev/vite";
import react from "@vitejs/plugin-react";
import { type Plugin, defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const workspaceRoot = path.resolve(__dirname, "../..");

// Plugin to handle workspace package changes
const workspacePlugin = (): Plugin => ({
  name: "workspace-hmr",
  enforce: "pre",
  configureServer(server) {
    const workspaceFiles = [
      path.resolve(workspaceRoot, "packages/core/src/**/*"),
      path.resolve(workspaceRoot, "packages/domain/src/**/*"),
    ];

    server.watcher.add(workspaceFiles);

    server.watcher.on("change", (file) => {
      // Check if the changed file is in one of our workspace packages
      if (file.includes("packages/core/src") || file.includes("packages/domain/src")) {
        console.log("Workspace file changed:", file);

        // Find all modules that depend on this file
        const moduleId = server.moduleGraph.getModuleById(file);
        if (moduleId) {
          // Invalidate the module and its importers
          for (const importer of moduleId.importers) {
            server.moduleGraph.invalidateModule(importer);
          }
        }

        // Force a full reload since we can't guarantee clean HMR
        server.ws.send({ type: "full-reload" });
      }
    });
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [
    workspacePlugin(),
    react(),
    reactRouter(),
    tsconfigPaths({
      projects: [
        path.resolve(__dirname, "tsconfig.json"),
        path.resolve(workspaceRoot, "packages/core/tsconfig.json"),
        path.resolve(workspaceRoot, "packages/domain/tsconfig.json"),
      ],
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "@bip/core": path.resolve(workspaceRoot, "packages/core/src"),
      "@bip/domain": path.resolve(workspaceRoot, "packages/domain/src"),
    },
  },
  optimizeDeps: {
    exclude: ["@bip/core", "@bip/domain"],
  },
  build: {
    sourcemap: mode === "development",
  },
}));
