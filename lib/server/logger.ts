export class Logger {
  private static instance: Logger;
  private constructor() {}
  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
  /**
   * Logs an informational message with an ISO timestamp.
   */
  public info(message: string, ...meta: unknown[]): void {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...meta);
  }
  /**
   * Logs an error message with an ISO timestamp.
   */
  public error(message: string, ...meta: unknown[]): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...meta);
  }
}
export const loggerInstance = Logger.getInstance();