export class CsvParser {
  private static instance: CsvParser;
  private constructor() {}
  public static getInstance(): CsvParser {
    if (!CsvParser.instance) CsvParser.instance = new CsvParser();
    return CsvParser.instance;
  }
  public parse(csv: string): Record<string, string>[] {
    const lines = csv.split('\n').map((l: string): string => l.trim()).filter((l: string): boolean => Boolean(l));
    if (lines.length < 2) return [];
    const headers = lines[0].split(',');
    return lines.slice(1).map((line: string): Record<string, string> => {
      const values = line.split(',');
      return headers.reduce((obj: Record<string, string>, header: string, index: number): Record<string, string> => {
        obj[header] = values[index] || '';
        return obj;
      }, {} as Record<string, string>);
    });
  }
}
export const csvParserInstance = CsvParser.getInstance();