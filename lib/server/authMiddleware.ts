export class AuthMiddleware {
  private static instance: AuthMiddleware;
  private constructor() {}
  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) AuthMiddleware.instance = new AuthMiddleware();
    return AuthMiddleware.instance;
  }
  public verifyToken(token: string): boolean {
    return token.length > 10; // Basic implementation
  }
  public extractUser(_token: string) {
    return { id: "user-1", role: "admin" };
  }
}
export const authMiddlewareInstance = AuthMiddleware.getInstance();