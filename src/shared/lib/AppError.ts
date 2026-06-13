/**
 * Custom application error class with error codes and context
 * All errors in the application should use this class for consistency
 */

export type AppErrorCode =
  | "PROFILE_NOT_FOUND"
  | "SQUAD_NOT_FOUND"
  | "UNAUTHORIZED"
  | "ANALYSIS_FAILED"
  | "FIRESTORE_UNAVAILABLE"
  | "INVALID_INPUT"
  | "RATE_LIMIT_EXCEEDED"
  | "AUTH_REQUIRED"
  | "INVALID_EMAIL"
  | "NETWORK_ERROR";

export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly context?: string;
  public readonly statusCode: number;

  constructor(code: AppErrorCode, context?: string, statusCode?: number) {
    super(`[${code}] ${context ?? ""}`);
    this.name = "AppError";
    this.code = code;
    this.context = context;
    this.statusCode = statusCode ?? mapErrorToStatusCode(code);

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Map error codes to HTTP status codes for API responses
 */
export function mapErrorToStatusCode(code: AppErrorCode): number {
  const statusMap: Record<AppErrorCode, number> = {
    PROFILE_NOT_FOUND: 404,
    SQUAD_NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    ANALYSIS_FAILED: 500,
    FIRESTORE_UNAVAILABLE: 503,
    INVALID_INPUT: 400,
    RATE_LIMIT_EXCEEDED: 429,
    AUTH_REQUIRED: 401,
    INVALID_EMAIL: 400,
    NETWORK_ERROR: 503,
  };

  return statusMap[code] ?? 500;
}

/**
 * Check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Get error message for user display (in Portuguese)
 */
export function getUserErrorMessage(code: AppErrorCode): string {
  const messageMap: Record<AppErrorCode, string> = {
    PROFILE_NOT_FOUND: "Perfil não encontrado.",
    SQUAD_NOT_FOUND: "Squad não encontrada.",
    UNAUTHORIZED: "Você não tem permissão para acessar isso.",
    ANALYSIS_FAILED: "A análise falhou. Tente novamente.",
    FIRESTORE_UNAVAILABLE: "Sem conexão com o banco de dados. Tente novamente mais tarde.",
    INVALID_INPUT: "Dados inválidos. Verifique e tente novamente.",
    RATE_LIMIT_EXCEEDED: "Muitas requisições. Aguarde um momento e tente novamente.",
    AUTH_REQUIRED: "Você precisa estar logado para isso.",
    INVALID_EMAIL: "Email inválido.",
    NETWORK_ERROR: "Erro de conexão. Verifique sua internet.",
  };

  return messageMap[code] ?? "Algo deu errado. Tente novamente.";
}
