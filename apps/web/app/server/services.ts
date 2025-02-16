import { getContainer, getServices } from "@bip/core";
import { db } from "./db";

const container = getContainer(db);
let services = getServices(container);

// Maintain singleton instance in development
declare global {
  var __services: typeof services | undefined;
}

if (process.env.NODE_ENV !== "production") {
  if (!global.__services) {
    global.__services = services;
  }
  services = global.__services;
}

export { services };
