// Define log levels type for better type safety
export type LogLevel = "error" | "warn" | "info" | "debug";

// Define a base logger interface (winston-style: message, meta)
export interface Logger {
  error: (message: string, meta?: object) => void;
  warn: (message: string, meta?: object) => void;
  info: (message: string, meta?: object) => void;
  debug: (message: string, meta?: object) => void;
  child(bindings: object): Logger;
}
