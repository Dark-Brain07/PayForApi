import { loggerInstance } from './logger';
export class EmailSender {
  private static instance: EmailSender;
  private constructor() {}
  public static getInstance(): EmailSender {
    if (!EmailSender.instance) EmailSender.instance = new EmailSender();
    return EmailSender.instance;
  }
  public async send(to: string, subject: string, body: string): Promise<boolean> {
    loggerInstance.info(`Sending email to ${to}: ${subject}`);
    return new Promise(resolve => setTimeout(() => resolve(true), 500));
  }
}
export const emailSenderInstance = EmailSender.getInstance();