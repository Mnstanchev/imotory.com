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

interface AgentNotificationProps {
  agentName: string;
  bookingId: string;
  listingTitle: string;
  listingPrice: string;
  scheduledAt: string;
  duration: number;
  visitType: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  message?: string;
}

export function AgentNotificationTemplate({
  agentName,
  bookingId,
  listingTitle,
  listingPrice,
  scheduledAt,
  duration,
  visitType,
  contactName,
  contactEmail,
  contactPhone,
  message
}: AgentNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New booking request for {listingTitle}</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto max-w-lg bg-white rounded-lg shadow-lg">
            <Section className="bg-green-600 text-white p-6 rounded-t-lg">
              <Heading className="text-2xl font-bold m-0 text-center">
                New Booking Request
              </Heading>
            </Section>
            
            <Section className="p-6">
              <Text className="text-lg mb-4">
                Hello {agentName},
              </Text>
              
              <Text className="mb-4">
                You have received a new {visitType.toLowerCase()} request for one of your properties.
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
                <Text className="font-bold mb-2">Client Information</Text>
                <Text className="text-gray-600 mb-1">Name: {contactName}</Text>
                <Text className="text-gray-600 mb-1">Email: {contactEmail}</Text>
                <Text className="text-gray-600 mb-1">Phone: {contactPhone}</Text>
              </Section>
              
              {message && (
                <Section className="bg-blue-50 p-4 rounded-lg mb-4">
                  <Text className="font-bold mb-2">Client Message</Text>
                  <Text className="text-gray-700">{message}</Text>
                </Section>
              )}
              
              <Text className="text-sm text-gray-600">
                Booking ID: {bookingId}
              </Text>
              
              <Text className="mt-4">
                Please contact the client to confirm the appointment or make any necessary arrangements.
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