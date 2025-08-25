import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import AboutClient from "./AboutClient";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('about', 'bg');
}

export default function AboutPage() {
  return <AboutClient />;
}


