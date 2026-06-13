export class FilterHelper {
  private static instance: FilterHelper;
  private constructor() {}
  public static getInstance(): FilterHelper {
    if (!FilterHelper.instance) FilterHelper.instance = new FilterHelper();
    return FilterHelper.instance;
  }
  public applyFilter<T extends Record<string, unknown>>(data: T[], criteria: Record<string, unknown>): T[] {
    return data.filter(item => {
      return Object.entries(criteria).every(([key, val]) => item[key] === val);
    });
  }
}
export const filterHelperInstance = FilterHelper.getInstance();