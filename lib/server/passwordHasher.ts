import { createHash } from 'crypto';
export class PasswordHasher {
  private static instance: PasswordHasher;
  private constructor() {}
  public static getInstance(): PasswordHasher {
    if (!PasswordHasher.instance) PasswordHasher.instance = new PasswordHasher();
    return PasswordHasher.instance;
  }
  public hash(password: string): string {
    return createHash('sha256').update(password + 'salt').digest('hex');
  }
  public verify(password: string, hash: string): boolean {
    return this.hash(password) === hash;
  }
}
export const passwordHasherInstance = PasswordHasher.getInstance();