export class CorsMiddleware {
  private static instance: CorsMiddleware;
  private allowedOrigins = ['http://localhost:3000', 'https://example.com'];
  private constructor() {}
  public static getInstance(): CorsMiddleware {
    if (!CorsMiddleware.instance) CorsMiddleware.instance = new CorsMiddleware();
    return CorsMiddleware.instance;
  }
  public getHeaders(origin: string) {
    if (this.allowedOrigins.includes(origin)) {
      return { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE' };
    }
    return {};
  }
}
export const corsMiddlewareInstance = CorsMiddleware.getInstance();