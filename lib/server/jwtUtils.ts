import { createHmac } from 'crypto';
export class JwtUtils {
  private static instance: JwtUtils;
  private secret = 'SUPER_SECRET_KEY';
  private constructor() {}
  public static getInstance(): JwtUtils {
    if (!JwtUtils.instance) JwtUtils.instance = new JwtUtils();
    return JwtUtils.instance;
  }
  public sign(payload: any): string {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64');
    const signature = createHmac('sha256', this.secret).update(header + '.' + body).digest('base64');
    return `${header}.${body}.${signature}`;
  }
}
export const jwtUtilsInstance = JwtUtils.getInstance();