import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
  title?: string;
}

export function EmailLayout({ children, preview, title = 'Property Bulgaria' }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <title>{title}</title>
      </Head>
      <Preview>
        {preview || 'Email Preview'}
        {/* Additional text to satisfy the multiple children requirement */}
        {' '}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-lg bg-white rounded-lg shadow-lg">
            <Section className="bg-blue-600 text-white p-6 rounded-t-lg">
              <Heading className="text-2xl font-bold m-0 text-center">
                Property Bulgaria
              </Heading>
            </Section>
            
            <Section className="p-6">
              {children}
            </Section>
            
            <Section className="bg-gray-100 p-4 rounded-b-lg">
              <Text className="text-sm text-gray-600 text-center">
                This email was sent from Property Bulgaria Real Estate
              </Text>
              <Text className="text-xs text-gray-500 text-center mt-2">
                <Link href="https://propertybulgaria.com" className="text-blue-600 hover:underline">
                  Visit our website
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}