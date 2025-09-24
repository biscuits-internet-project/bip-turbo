import type { Logger } from "@bip/domain";
import winston from "winston";

/**
 * Creates a logger instance for use in test scripts and CLI tools
 */
export const createTestLogger = (): Logger => {
  return winston.createLogger({
    level: process.env.LOG_LEVEL || "warn",
    format: winston.format.combine(
      winston.format.timestamp({ format: "HH:mm:ss" }),
      winston.format.colorize(),
      winston.format.simple()
    ),
    transports: [
      new winston.transports.Console()
    ]
  }) as unknown as Logger;
};

export const testLogger = createTestLogger();