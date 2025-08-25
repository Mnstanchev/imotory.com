import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import CookiePreferencesPageClient from "./CookiePreferencesPageClient";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('cookiePreferences', 'bg');
}

export default function CookiePreferencesPage() {
  return <CookiePreferencesPageClient />;
}


