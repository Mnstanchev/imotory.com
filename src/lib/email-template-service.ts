import { prisma } from './prisma';

export class EmailTemplateService {
  static async getTemplate(type: string, language: string = 'en') {
    const template = await prisma.emailTemplate.findFirst({
      where: {
        type,
        isActive: true,
      },
    });

    if (!template) {
      throw new Error(`No active template found for type: ${type}`);
    }

    return {
      subject: (template.subject as any)?.[language] || (template.subject as any)?.en || '',
      body: (template.body as any)?.[language] || (template.body as any)?.en || '',
      variables: template.variables,
    };
  }

  static replaceVariables(text: string, variables: Record<string, string>) {
    return Object.entries(variables).reduce(
      (result, [key, value]) => result.replace(new RegExp(`{{${key}}}`, 'g'), value),
      text
    );
  }

  static async renderTemplate(
    type: string,
    variables: Record<string, string>,
    language: string = 'en'
  ) {
    const template = await this.getTemplate(type, language);

    return {
      subject: this.replaceVariables(template.subject, variables),
      body: this.replaceVariables(template.body, variables),
    };
  }

  static async sendTestEmail(templateId: string, testEmail: string) {
    const template = await prisma.emailTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      throw new Error('Template not found');
    }

    // Use dummy data for testing
    const dummyVariables = template.variables.reduce((acc, variable) => {
      acc[variable] = `[Test ${variable}]`;
      return acc;
    }, {} as Record<string, string>);

    const { subject, body } = {
      subject: this.replaceVariables((template.subject as any)?.en || '', dummyVariables),
      body: this.replaceVariables((template.body as any)?.en || '', dummyVariables),
    };

    const { sendEmail } = await import('./email');
    await sendEmail(
      {
        to: testEmail,
        subject: `[TEST] ${subject}`,
      },
      body
    );
  }
}