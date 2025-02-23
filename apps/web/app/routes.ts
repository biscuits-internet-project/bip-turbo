import type { RouteConfig } from "@react-router/dev/routes";
// app/routes.ts
import { flatRoutes } from "@react-router/fs-routes";

export default flatRoutes() satisfies RouteConfig;
