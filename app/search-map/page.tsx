import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";
import SearchMapPageWrapper from "./SearchMapPageWrapper";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('searchMap', 'bg');
}

export default function SearchMapPage() {
  return <SearchMapPageWrapper />;
}