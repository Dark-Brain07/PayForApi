export class HealthCheck {
  private static instance: HealthCheck;
  private constructor() {}
  public static getInstance(): HealthCheck {
    if (!HealthCheck.instance) HealthCheck.instance = new HealthCheck();
    return HealthCheck.instance;
  }
  public getStatus(): { status: string; uptime: number; timestamp: Date } {
    return { status: 'OK', uptime: process.uptime(), timestamp: new Date() };
  }
}
export const healthCheckInstance = HealthCheck.getInstance();