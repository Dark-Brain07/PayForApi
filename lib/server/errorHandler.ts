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
  public handle(error: Error): { statusCode: number, message: string } {
    loggerInstance.error('[ErrorHandled]', error.message);
    return { statusCode: 500, message: 'Internal Server Error' };
  }
}
export const errorHandlerInstance = ErrorHandler.getInstance();