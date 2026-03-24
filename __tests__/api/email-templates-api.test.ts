import { describe, expect, it, beforeAll, afterAll } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/admin/email-templates/route';
import { prisma } from '@/src/lib/prisma';
import { cleanupDatabase } from '../helpers/test-setup';

// Mock authentication
jest.mock('@/src/lib/api-auth', () => ({
  requireAdmin: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Email Templates API', () => {
  const testTemplate = {
    name: 'Test API Template',
    type: 'test_notification',
    subject: {
      en: 'Test Subject {{variable}}',
      bg: 'Тест Заглавие {{variable}}',
    },
    body: {
      en: 'Test Body {{variable}}',
      bg: 'Тест Съдържание {{variable}}',
    },
    variables: ['variable'],
    isActive: true,
  };

  beforeEach(async () => {
    await cleanupDatabase();
  });

  it('should create a new email template', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: testTemplate,
    });

    await POST(req);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.name).toBe(testTemplate.name);
    expect(data.type).toBe(testTemplate.type);
  });

  it('should list email templates', async () => {
    // First create a template
    await prisma.emailTemplate.create({
      data: testTemplate,
    });

    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/admin/email-templates',
    });

    await GET(req);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data.templates)).toBe(true);
    expect(data.templates.length).toBeGreaterThan(0);
    expect(data.templates[0].name).toBe(testTemplate.name);
  });

  it('should filter templates by type', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: '/api/admin/email-templates?type=test_notification',
    });

    await GET(req);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(Array.isArray(data.templates)).toBe(true);
    expect(data.templates.every(t => t.type === 'test_notification')).toBe(true);
  });

  it('should preview a template', async () => {
    // First get the template ID
    const template = await prisma.emailTemplate.findFirst({
      where: { name: testTemplate.name },
    });

    const { req, res } = createMocks({
      method: 'POST',
      url: `/api/admin/email-templates/${template.id}/preview`,
      body: {
        variables: {
          variable: 'Test Value',
        },
        language: 'en',
      },
    });

    await POST(req);

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.subject).toBe('Test Subject Test Value');
    expect(data.body).toBe('Test Body Test Value');
  });
});