import type { Logger } from "@bip/domain";
import winston from "winston";

const NODE_ENV = process.env.NODE_ENV;
const LOG_LEVEL = process.env.LOG_LEVEL;
const isProduction = NODE_ENV === "production";
const defaultLevel = isProduction ? "warn" : "info";

const productionFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.simple()
);

export const createLogger = (options?: winston.LoggerOptions): Logger => {
  const logger = winston.createLogger({
    level: LOG_LEVEL || defaultLevel,
    format: isProduction ? productionFormat : developmentFormat,
    transports: [
      new winston.transports.Console({
        stderrLevels: ['error'],
        handleExceptions: true,
        handleRejections: true
      })
    ],
    handleExceptions: true,
    handleRejections: true,
    exitOnError: false,
    ...options,
  });

  // Graceful shutdown for Fly.io containerized environment
  const gracefulShutdown = () => {
    logger.end();
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  return logger as unknown as Logger;
};

// Create the default logger instance
export const logger = createLogger();
