import { Resend } from 'resend';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions, template: React.ReactElement | string) {
  const html = typeof template === 'string' ? template : await render(template);
  
  try {
    const result = await resend.emails.send({
      from: options.from || process.env.NO_REPLY_EMAIL || 'noreply@propertybulgaria.com',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html,
      replyTo: options.replyTo || process.env.ADMIN_EMAIL || 'admin@propertybulgaria.com',
    });

    return { success: true, data: result };
  } catch (error) {

    return { success: false, error };
  }
}

export async function sendTextEmail(options: EmailOptions, text: string) {
  try {
    const result = await resend.emails.send({
      from: options.from || process.env.NO_REPLY_EMAIL || 'noreply@propertybulgaria.com',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      text,
      replyTo: options.replyTo || process.env.ADMIN_EMAIL || 'admin@propertybulgaria.com',
    });

    return { success: true, data: result };
  } catch (error) {

    return { success: false, error };
  }
}