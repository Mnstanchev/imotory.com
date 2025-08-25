import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import ConciergePageClient from "./ConciergePageClient";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('concierge', 'bg');
}

export default function ConciergePage() {
  return <ConciergePageClient />;
}


