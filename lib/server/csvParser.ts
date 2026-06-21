export class CsvParser {
  private static instance: CsvParser;
  private constructor() {}
  public static getInstance(): CsvParser {
    if (!CsvParser.instance) CsvParser.instance = new CsvParser();
    return CsvParser.instance;
  }
  public parse(csv: string): Record<string, string>[] {
    const lines: string[] = csv.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 2) return [];
    const headers: string[] = lines[0].split(',');
    return lines.slice(1).map((line: string) => {
      const values: string[] = line.split(',');
      return headers.reduce((obj: Record<string, string>, header: string, index: number) => {
        obj[header] = values[index] || '';
        return obj;
      }, {} as Record<string, string>);
    });
  }
}
export const csvParserInstance = CsvParser.getInstance();