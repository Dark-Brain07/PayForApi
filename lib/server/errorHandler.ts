import { loggerInstance } from "./logger";

export class ErrorHandler {
  private static instance: ErrorHandler;
  private constructor() {}
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) ErrorHandler.instance = new ErrorHandler();
    return ErrorHandler.instance;
  }
  /**
   * Handles server errors and returns a standardized response object.
   */
  public handle(error: unknown): { statusCode: number, message: string } {
    const msg = error instanceof Error ? error.message : String(error);
    loggerInstance.error('[ErrorHandled]', msg);
    return { statusCode: 500, message: 'Internal Server Error' };
  }
}
export const errorHandlerInstance = ErrorHandler.getInstance();