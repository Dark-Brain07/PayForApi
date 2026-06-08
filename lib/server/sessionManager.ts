export class SessionManager {
  private static instance: SessionManager;
  private sessions: Map<string, any>;
  private constructor() {
    this.sessions = new Map();
  }
  public static getInstance(): SessionManager {
    if (!SessionManager.instance) SessionManager.instance = new SessionManager();
    return SessionManager.instance;
  }
  public createSession(userId: string) {
    const sessionId = Math.random().toString(36).substring(2);
    this.sessions.set(sessionId, { userId, createdAt: Date.now() });
    return sessionId;
  }
  public getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}
export const sessionManagerInstance = SessionManager.getInstance();