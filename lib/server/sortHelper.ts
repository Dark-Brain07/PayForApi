export class SortHelper {
  private static instance: SortHelper;
  private constructor() {}
  public static getInstance(): SortHelper {
    if (!SortHelper.instance) SortHelper.instance = new SortHelper();
    return SortHelper.instance;
  }
  public sort<T>(data: T[], key: keyof T, order: 'asc' | 'desc' = 'asc') {
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
export const sortHelperInstance = SortHelper.getInstance();