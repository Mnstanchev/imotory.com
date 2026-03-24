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

interface BookingConfirmationProps {
  bookingId: string;
  listingTitle: string;
  listingPrice: string;
  agentName: string;
  agentEmail: string;
  scheduledAt: string;
  duration: number;
  visitType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message?: string;
}

export function BookingConfirmationTemplate({
  bookingId,
  listingTitle,
  listingPrice,
  agentName,
  agentEmail,
  scheduledAt,
  duration,
  visitType,
  contactName,
  contactEmail,
  contactPhone,
  message
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your property viewing has been scheduled</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-lg bg-white rounded-lg shadow-lg">
            <Section className="bg-blue-600 text-white p-6 rounded-t-lg">
              <Heading className="text-2xl font-bold m-0 text-center">
                Booking Confirmation
              </Heading>
            </Section>
            
            <Section className="p-6">
              <Text className="text-lg mb-4">
                Hello {contactName},
              </Text>
              
              <Text className="mb-4">
                Your {visitType.toLowerCase()} has been successfully scheduled for the following property:
              </Text>
              
              <Section className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="font-bold text-lg mb-2">{listingTitle}</Text>
                <Text className="text-gray-600 mb-1">Price: {listingPrice}</Text>
                <Text className="text-gray-600 mb-1">Date: {new Date(scheduledAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</Text>
                <Text className="text-gray-600 mb-1">Duration: {duration} minutes</Text>
                <Text className="text-gray-600 mb-1">Type: {visitType}</Text>
              </Section>
              
              <Section className="bg-gray-50 p-4 rounded-lg mb-4">
                <Text className="font-bold mb-2">Your Agent</Text>
                <Text className="text-gray-600 mb-1">{agentName}</Text>
                <Text className="text-gray-600 mb-1">{agentEmail}</Text>
              </Section>
              
              {message && (
                <Section className="bg-blue-50 p-4 rounded-lg mb-4">
                  <Text className="font-bold mb-2">Your Message</Text>
                  <Text className="text-gray-700">{message}</Text>
                </Section>
              )}
              
              <Text className="text-sm text-gray-600">
                Booking ID: {bookingId}
              </Text>
              
              <Text className="mt-4">
                We'll contact you if there are any changes. If you need to reschedule or have questions, please reply to this email.
              </Text>
            </Section>
            
            <Section className="bg-gray-100 p-4 rounded-b-lg">
              <Text className="text-sm text-gray-600 text-center">
                Thank you for choosing Property Bulgaria
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}