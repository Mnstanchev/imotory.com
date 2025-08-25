import type { Metadata } from "next";
import { generatePageMetadata } from "../lib/metadata";
import HomePageClient from "./HomePageClient";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('home', 'bg');
}

export default function HomePage() {
  return <HomePageClient />;
}
