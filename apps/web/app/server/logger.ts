import type { Logger } from "@bip/domain";
import winston from "winston";

const NODE_ENV = process.env.NODE_ENV;
const LOG_LEVEL = process.env.LOG_LEVEL;
const isProduction = NODE_ENV === "production";
const defaultLevel = isProduction ? "warn" : "info";

const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.simple(),
);

// Track if shutdown handlers have been registered to prevent duplicate listeners
let shutdownHandlersRegistered = false;

export const createLogger = (options?: winston.LoggerOptions): Logger => {
  const logger = winston.createLogger({
    level: LOG_LEVEL || defaultLevel,
    format: isProduction ? productionFormat : developmentFormat,
    transports: [
      new winston.transports.Console({
        stderrLevels: ["error"],
        // CRITICAL: Disable exception/rejection handling to prevent memory leaks
        // These handlers can accumulate error objects with closures holding request data
        // React Router and Node.js handle unhandled exceptions at a higher level
        handleExceptions: false,
        handleRejections: false,
      }),
    ],
    // CRITICAL: Disable global exception/rejection handling to prevent memory accumulation
    // Winston's exception handlers can accumulate error objects that hold onto closures
    // with references to request data, React rendering context, etc.
    handleExceptions: false,
    handleRejections: false,
    exitOnError: false,
    ...options,
  });

  // Graceful shutdown for Fly.io containerized environment
  // Only register handlers once to prevent memory leaks from duplicate listeners
  if (!shutdownHandlersRegistered) {
    const gracefulShutdown = () => {
      logger.end();
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
    shutdownHandlersRegistered = true;
  }

  return logger as unknown as Logger;
};

// Create the default logger instance
export const logger = createLogger();
