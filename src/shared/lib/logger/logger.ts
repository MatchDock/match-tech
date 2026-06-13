import type { LogContext, LogLevel, LogScope } from "./logger.types";

const isDev = import.meta.env.DEV;

const scopeColors: Record<LogScope, string> = {
  auth: "color: #FF2E93; font-weight: bold",
  firestore: "color: #00E5FF; font-weight: bold",
  firebase: "color: #FFC900; font-weight: bold",
  router: "color: #B8FF29; font-weight: bold",
  api: "color: #9C27B0; font-weight: bold",
  ui: "color: #607D8B; font-weight: bold",
  app: "color: #FF5722; font-weight: bold",
};

const levelIcons: Record<LogLevel, string> = {
  info: "ℹ️",
  warn: "⚠️",
  error: "❌",
  debug: "🔍",
};

function getTimestamp() {
  return new Date().toLocaleTimeString("pt-BR", {
    hour12: false,
    fractionalSecondDigits: 3,
  });
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return error;
}

function writeLog(
  scope: LogScope,
  level: LogLevel,
  message: string,
  context?: LogContext
) {
  if (level === "debug" && !isDev) return;

  const prefix = `${levelIcons[level]} [${getTimestamp()}] [${scope}]`;
  const color = scopeColors[scope];

  const payload = context ?? {};

  if (level === "error") {
    console.error(`%c${prefix}`, color, message, payload);
    return;
  }

  if (level === "warn") {
    console.warn(`%c${prefix}`, color, message, payload);
    return;
  }

  if (level === "info") {
    console.info(`%c${prefix}`, color, message, payload);
    return;
  }

  console.debug(`%c${prefix}`, color, message, payload);
}

export function createLogger(scope: LogScope) {
  return {
    info(message: string, context?: LogContext) {
      writeLog(scope, "info", message, context);
    },
    warn(message: string, context?: LogContext) {
      writeLog(scope, "warn", message, context);
    },
    error(message: string, error?: unknown, context?: LogContext) {
      writeLog(scope, "error", message, {
        ...context,
        error: normalizeError(error),
      });
    },
    debug(message: string, context?: LogContext) {
      writeLog(scope, "debug", message, context);
    },
  };
}

export const appLog = createLogger("app");
export const authLog = createLogger("auth");
export const firestoreLog = createLogger("firestore");
export const firebaseLog = createLogger("firebase");
export const apiLog = createLogger("api");
export const uiLog = createLogger("ui");