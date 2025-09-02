import type { Logger } from "@bip/domain";
import { PrismaClient } from "@prisma/client";
import { createContainer } from "../../_shared/container";
import { getServices } from "../../_shared/services";

// Simple console logger for scripts
const logger: Logger = {
  info: (obj: string | object, msg?: string) => console.log(`ℹ️ ${typeof obj === 'string' ? obj : JSON.stringify(obj)}${msg ? ' ' + msg : ''}`),
  warn: (obj: string | object, msg?: string) => console.warn(`⚠️ ${typeof obj === 'string' ? obj : JSON.stringify(obj)}${msg ? ' ' + msg : ''}`),
  error: (obj: string | object, msg?: string) => console.error(`❌ ${typeof obj === 'string' ? obj : JSON.stringify(obj)}${msg ? ' ' + msg : ''}`),
  debug: (obj: string | object, msg?: string) => console.debug(`🐛 ${typeof obj === 'string' ? obj : JSON.stringify(obj)}${msg ? ' ' + msg : ''}`),
  fatal: (obj: string | object, msg?: string) => console.error(`💀 ${typeof obj === 'string' ? obj : JSON.stringify(obj)}${msg ? ' ' + msg : ''}`),
  trace: (obj: string | object, msg?: string) => console.trace(`🔍 ${typeof obj === 'string' ? obj : JSON.stringify(obj)}${msg ? ' ' + msg : ''}`),
  child: (_bindings: object) => logger,
};

// Environment setup
const env = {
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
};

// Create database connection
const db = new PrismaClient();

// Create the main container and services
const container = createContainer({ db, logger, env });
const services = getServices(container);

// Export for scripts to use
export { container, services, db };