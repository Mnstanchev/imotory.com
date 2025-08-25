import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import ContactPageClient from "./ContactPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('contact', 'bg');
}

export default function ContactPage() {
  return <ContactPageClient />;
}


