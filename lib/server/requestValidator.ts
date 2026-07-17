export class RequestValidator {
  private static instance: RequestValidator;
  private constructor() {}
  public static getInstance(): RequestValidator {
    if (!RequestValidator.instance) RequestValidator.instance = new RequestValidator();
    return RequestValidator.instance;
  }
  /**
   * Validates a payload against a given schema.
   * @param payload - The data to validate
   * @param schema - The validation schema object with a parse method
   */
  public validate(payload: unknown, schema: { parse: (val: unknown) => unknown }): boolean {
    try {
      schema.parse(payload);
      return true;
    } catch {
      return false;
    }
  }
}
export const requestValidatorInstance: RequestValidator = RequestValidator.getInstance();