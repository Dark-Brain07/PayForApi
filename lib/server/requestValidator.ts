export class RequestValidator {
  private static instance: RequestValidator;
  private constructor() {}
  public static getInstance(): RequestValidator {
    if (!RequestValidator.instance) RequestValidator.instance = new RequestValidator();
    return RequestValidator.instance;
  }
  public validate(payload: any, schema: any): boolean {
    try {
      schema.parse(payload);
      return true;
    } catch {
      return false;
    }
  }
}
export const requestValidatorInstance = RequestValidator.getInstance();