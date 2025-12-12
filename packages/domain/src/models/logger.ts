// Define log levels type for better type safety
export type LogLevel = "error" | "warn" | "info" | "debug";

// Define a base logger interface
export interface Logger {
  error: (obj: object | string, msg?: string) => void;
  warn: (obj: object | string, msg?: string) => void;
  info: (obj: object | string, msg?: string) => void;
  debug: (obj: object | string, msg?: string) => void;
  child(bindings: object): Logger;
}
