export class ResponseFormatter {
  private static instance: ResponseFormatter;
  private constructor() {}
  public static getInstance(): ResponseFormatter {
    if (!ResponseFormatter.instance) ResponseFormatter.instance = new ResponseFormatter();
    return ResponseFormatter.instance;
  }
  public success<T>(data: T, message = 'Success') {
    return { success: true, message, data };
  }
  public error(message: string, code = 400) {
    return { success: false, error: message, code };
  }
}
export const responseFormatterInstance = ResponseFormatter.getInstance();