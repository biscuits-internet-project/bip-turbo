import type { Logger } from "@bip/domain";
import winston from "winston";

const NODE_ENV = process.env.NODE_ENV;
const LOG_LEVEL = process.env.LOG_LEVEL;
const isProduction = NODE_ENV === "production";
const defaultLevel = isProduction ? "warn" : "info";

/** How many `cause` links to follow, so a chain that loops back on itself still ends. */
const MAX_CAUSE_DEPTH = 5;

/**
 * A plain-object view of a thrown value. An Error's name, message and stack
 * (and a Response's status) aren't enumerable, so JSON-logging them as-is
 * writes `{}` and loses everything that says what went wrong. An Error's own
 * fields, such as a Prisma error's `code` and `meta`, are kept.
 */
function describeThrown(value: unknown, depth = 0): unknown {
  if (value instanceof Error) {
    return {
      ...value,
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...(value.cause !== undefined && {
        cause: depth < MAX_CAUSE_DEPTH ? describeThrown(value.cause, depth + 1) : "[cause chain truncated]",
      }),
    };
  }
  if (value instanceof Response) {
    const location = value.headers.get("Location");
    return { status: value.status, statusText: value.statusText, ...(location && { location }) };
  }
  return value;
}

/**
 * Winston's `errors` format only handles an Error passed as the message, not
 * one passed as metadata (`logger.error("…", { error })`), which is how the app
 * logs failures. This format describes every Error or Response in the metadata.
 */
export const serializeThrownMeta = winston.format((info) => {
  for (const key in info) {
    info[key] = describeThrown(info[key]);
  }
  return info;
});

const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  serializeThrownMeta(),
  winston.format.json(),
);

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  serializeThrownMeta(),
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
