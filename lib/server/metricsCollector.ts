export class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: Record<string, number>;
  private constructor() {
    this.metrics = {};
  }
  public static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) MetricsCollector.instance = new MetricsCollector();
    return MetricsCollector.instance;
  }
  public increment(key: string) {
    this.metrics[key] = (this.metrics[key] || 0) + 1;
  }
  public getMetrics() {
    return { ...this.metrics };
  }
}
export const metricsCollectorInstance = MetricsCollector.getInstance();