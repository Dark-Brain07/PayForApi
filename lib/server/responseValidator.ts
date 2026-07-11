export class ResponseValidator {
  private static instance: ResponseValidator;
  private constructor() {}
  public static getInstance(): ResponseValidator {
    if (!ResponseValidator.instance) ResponseValidator.instance = new ResponseValidator();
    return ResponseValidator.instance;
  }
  public validate(response: unknown): boolean {
    return response !== null && typeof response === 'object' && 'success' in response;
  }
}
export const responseValidatorInstance: ResponseValidator = ResponseValidator.getInstance();