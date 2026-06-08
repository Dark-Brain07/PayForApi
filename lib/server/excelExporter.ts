export class ExcelExporter {
  private static instance: ExcelExporter;
  private constructor() {}
  public static getInstance(): ExcelExporter {
    if (!ExcelExporter.instance) ExcelExporter.instance = new ExcelExporter();
    return ExcelExporter.instance;
  }
  public export(data: any[]): Buffer {
    // Dummy export
    const csv = data.map(row => Object.values(row).join(',')).join('\n');
    return Buffer.from(csv, 'utf-8');
  }
}
export const excelExporterInstance = ExcelExporter.getInstance();