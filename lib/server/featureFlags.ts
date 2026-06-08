export class FeatureFlags {
  private static instance: FeatureFlags;
  private flags: Record<string, boolean>;
  private constructor() {
    this.flags = { newDashboard: true, betaFeatures: false };
  }
  public static getInstance(): FeatureFlags {
    if (!FeatureFlags.instance) FeatureFlags.instance = new FeatureFlags();
    return FeatureFlags.instance;
  }
  public isEnabled(flagName: string): boolean {
    return !!this.flags[flagName];
  }
  public setFlag(flagName: string, value: boolean) {
    this.flags[flagName] = value;
  }
}
export const featureFlagsInstance = FeatureFlags.getInstance();