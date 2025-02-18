import type { Logger } from "@bip/domain";
import pino from "pino";

export const createLogger = (options?: pino.LoggerOptions): Logger => {
  return pino({
    level: process.env.LOG_LEVEL || "info",
    // Development formatting
    transport:
      process.env.NODE_ENV !== "production"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
            },
          }
        : undefined,
    // Base configuration
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    // Merge in any custom options
    ...options,
  });
};

// Create the default logger instance
export const logger = createLogger();
