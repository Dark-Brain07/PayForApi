export class ExcelExporter {
  private static instance: ExcelExporter;
  private constructor() {}
  public static getInstance(): ExcelExporter {
    if (!ExcelExporter.instance) ExcelExporter.instance = new ExcelExporter();
    return ExcelExporter.instance;
  }
  public export<T extends Record<string, unknown>>(data: T[]): Buffer {
    // Dummy export
    const csv = data.map((row: T) => Object.values(row).join(',')).join('\n');
    return Buffer.from(csv, 'utf-8');
  }
}
export const excelExporterInstance = ExcelExporter.getInstance();