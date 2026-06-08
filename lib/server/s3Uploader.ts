export class S3Uploader {
  private static instance: S3Uploader;
  private constructor() {}
  public static getInstance(): S3Uploader {
    if (!S3Uploader.instance) S3Uploader.instance = new S3Uploader();
    return S3Uploader.instance;
  }
  public async upload(fileBuffer: Buffer, key: string): Promise<string> {
    // Mock upload
    return `https://s3.mock.com/bucket/${key}`;
  }
}
export const s3UploaderInstance = S3Uploader.getInstance();