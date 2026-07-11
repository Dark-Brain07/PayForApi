export class PdfGenerator {
  private static instance: PdfGenerator;
  private constructor() {}
  public static getInstance(): PdfGenerator {
    if (!PdfGenerator.instance) PdfGenerator.instance = new PdfGenerator();
    return PdfGenerator.instance;
  }
  public async generate(html: string): Promise<Buffer> {
    // Dummy PDF generator
    return Buffer.from('%PDF-1.4 mock pdf content ' + html.length, 'utf-8');
  }
}
export const pdfGeneratorInstance: PdfGenerator = PdfGenerator.getInstance();