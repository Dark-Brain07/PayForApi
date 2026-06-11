export class Logger {
  private static instance: Logger;
  private constructor() {}
  public static getInstance(): Logger {
    if (!Logger.instance) Logger.instance = new Logger();
    return Logger.instance;
  }
  public info(message: string, ...meta: unknown[]) {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...meta);
  }
  public error(message: string, ...meta: unknown[]) {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, ...meta);
  }
}
export const loggerInstance = Logger.getInstance();