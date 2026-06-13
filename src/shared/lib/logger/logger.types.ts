export type LogLevel = "info" | "warn" | "error" | "debug";
export type LogScope = "auth" | "firestore" | "firebase" | "router" | "api" | "ui" | "app";
export type LogContext = Record<string, unknown>;