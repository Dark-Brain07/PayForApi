import { createHash, randomBytes } from 'crypto';
const DEFAULT_TOKEN_LENGTH = 32;

export class CryptoUtils {
  private static instance: CryptoUtils;
  private constructor() {}
  public static getInstance(): CryptoUtils {
    if (!CryptoUtils.instance) CryptoUtils.instance = new CryptoUtils();
    return CryptoUtils.instance;
  }
  public hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
  public generateRandomToken(bytes: number = DEFAULT_TOKEN_LENGTH): string {
    return randomBytes(bytes).toString('hex');
  }
}
export const cryptoUtilsInstance = CryptoUtils.getInstance();