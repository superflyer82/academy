import nodemailer from 'nodemailer';
import { logger } from './logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'localhost',
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail(options: MailOptions): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    logger.debug({ to: options.to, subject: options.subject }, 'Email suppressed in test mode');
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? 'noreply@musterhausen.de',
      ...options,
    });
    logger.info({ to: options.to, subject: options.subject }, 'Email sent');
  } catch (err) {
    logger.error({ err, to: options.to }, 'Failed to send email');
    // Don't throw – email failure should not break the main flow
  }
}
