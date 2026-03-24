import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface ContactFormNotificationProps {
  contactFormId: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  listingTitle?: string;
  listingPrice?: string;
}

export function ContactFormNotificationTemplate({
  contactFormId,
  name,
  email,
  phone,
  subject,
  message,
  listingTitle,
  listingPrice
}: ContactFormNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission: {subject}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-lg bg-white rounded-lg shadow-lg">
            <Section className="bg-purple-600 text-white p-6 rounded-t-lg">
              <Heading className="text-2xl font-bold m-0 text-center">
                New Contact Form Submission
              </Heading>
            </Section>
            
            <Section className="p-6">
              <Text className="text-lg mb-4">
                Hello Admin,
              </Text>
              
              <Text className="mb-4">
                You have received a new contact form submission.
              </Text>
              
              <Section className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="font-bold mb-2">Contact Details</Text>
                <Text className="text-gray-600 mb-1">Name: {name}</Text>
                <Text className="text-gray-600 mb-1">Email: {email}</Text>
                {phone && <Text className="text-gray-600 mb-1">Phone: {phone}</Text>}
                <Text className="text-gray-600 mb-1">Subject: {subject}</Text>
              </Section>
              
              {listingTitle && (
                <Section className="bg-gray-50 p-4 rounded-lg mb-4">
                  <Text className="font-bold mb-2">Property Inquiry</Text>
                  <Text className="text-gray-600 mb-1">Property: {listingTitle}</Text>
                  {listingPrice && <Text className="text-gray-600 mb-1">Price: {listingPrice}</Text>}
                </Section>
              )}
              
              <Section className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="font-bold mb-2">Message</Text>
                <Text className="text-gray-700 whitespace-pre-wrap">{message}</Text>
              </Section>
              
              <Text className="text-sm text-gray-600">
                Contact Form ID: {contactFormId}
              </Text>
              
              <Text className="mt-4">
                Please respond to this inquiry as soon as possible.
              </Text>
            </Section>
            
            <Section className="bg-gray-100 p-4 rounded-b-lg">
              <Text className="text-sm text-gray-600 text-center">
                Property Bulgaria Real Estate
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}