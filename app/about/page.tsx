import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Wiselive.co",
  description: "Explore your real estate dream into reality. Sharing homes since 1993.",
};

export default function AboutPage() {
  return <AboutClient />;
}


