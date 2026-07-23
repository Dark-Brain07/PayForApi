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
   * @param {string} message - The error message to log
   */
  public error(message: string, metadata?: Record<string, unknown>): void {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, metadata || {});
  }
  /**
   * Logs a warning message with an ISO timestamp.
   * @param {string} message - The warning message to log
   */
  public warn(message: string, metadata?: Record<string, unknown>): void {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, metadata || {});
  }
}
/** Global singleton logger instance */
export const loggerInstance = Logger.getInstance();