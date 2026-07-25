import { loggerInstance } from "./logger";

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private constructor() {}
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) ErrorHandler.instance = new ErrorHandler();
    return ErrorHandler.instance;
  }
  /**
   * Handles server errors and returns a standardized response object.
   * @param {unknown} error - The caught server exception or error instance
   * @returns {ApiErrorResponse} Standardized HTTP status and message payload
   */
  public handle(error: unknown): ApiErrorResponse {
    const msg = error instanceof Error ? error.message : String(error);
    loggerInstance.error('[ErrorHandled]', msg);
    return { statusCode: 500, message: 'Internal Server Error' };
  }
}
export const errorHandlerInstance = ErrorHandler.getInstance();