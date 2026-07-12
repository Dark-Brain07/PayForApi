/**
 * Session Manager Utility
 * Manages user sessions in memory.
 */
export interface SessionData {
  userId: string;
  createdAt: number;
}

export class SessionManager {
  private static instance: SessionManager;
  private sessions: Map<string, SessionData>;
  private constructor() {
    this.sessions = new Map();
  }
  public static getInstance(): SessionManager {
    if (!SessionManager.instance) SessionManager.instance = new SessionManager();
    return SessionManager.instance;
  }
const RADIX = 36;
  public createSession(userId: string) {
    const sessionId = Math.random().toString(RADIX).substring(2);
    this.sessions.set(sessionId, { userId, createdAt: Date.now() });
    return sessionId;
  }
  public getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }
}
/** Global singleton instance of SessionManager */
export const sessionManagerInstance: SessionManager = SessionManager.getInstance();