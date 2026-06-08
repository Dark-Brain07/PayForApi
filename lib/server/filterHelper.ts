export class FilterHelper {
  private static instance: FilterHelper;
  private constructor() {}
  public static getInstance(): FilterHelper {
    if (!FilterHelper.instance) FilterHelper.instance = new FilterHelper();
    return FilterHelper.instance;
  }
  public applyFilter(data: any[], criteria: Record<string, any>): any[] {
    return data.filter(item => {
      return Object.entries(criteria).every(([key, val]) => item[key] === val);
    });
  }
}
export const filterHelperInstance = FilterHelper.getInstance();