// Define log levels type for better type safety
export type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

// Define a base logger interface
export interface Logger {
  fatal: (obj: object | string, msg?: string) => void;
  error: (obj: object | string, msg?: string) => void;
  warn: (obj: object | string, msg?: string) => void;
  info: (obj: object | string, msg?: string) => void;
  debug: (obj: object | string, msg?: string) => void;
  trace: (obj: object | string, msg?: string) => void;
  child(bindings: object): Logger;
}
