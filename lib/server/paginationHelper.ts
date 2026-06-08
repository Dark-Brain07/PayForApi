export class PaginationHelper {
  private static instance: PaginationHelper;
  private constructor() {}
  public static getInstance(): PaginationHelper {
    if (!PaginationHelper.instance) PaginationHelper.instance = new PaginationHelper();
    return PaginationHelper.instance;
  }
  public paginate(data: any[], page: number, pageSize: number) {
    const start = (page - 1) * pageSize;
    return {
      total: data.length,
      page,
      pageSize,
      items: data.slice(start, start + pageSize),
      totalPages: Math.ceil(data.length / pageSize)
    };
  }
}
export const paginationHelperInstance = PaginationHelper.getInstance();