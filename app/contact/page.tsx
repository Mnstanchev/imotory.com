import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('contact', 'bg');
}

"use client";

import ContactUsForm from "@/components/ContactUsForm";
import MiniMap from "@/components/listing/MiniMap";

export default function ContactPage() {
  // Office coordinates (Sofia center as placeholder). Adjust as needed.
  const officeLat = 42.6977;
  const officeLng = 23.3219;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
            The next step is yours, talk to us!
          </h1>
          <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
            Kindly send us a message using the form or get in touch with us through the other available mediums below and we'll get back to you promptly!
          </p>
        </div>
      </section>

      {/* Form + Map */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <div className="h-full">
            <ContactUsForm />
          </div>
          <div className="relative rounded-md border border-gray-200 overflow-hidden shadow-sm h-full">
            <div className="absolute inset-0">
              <MiniMap lat={officeLat} lng={officeLng} />
            </div>
            <div className="absolute bottom-4 left-4 bg-white border border-gray-200 shadow-sm rounded-md px-3 py-2">
              <div className="text-gray-900 font-medium">Office</div>
              <div className="text-gray-600 text-sm">Sofia, Bulgaria</div>
              <a
                className="inline-block mt-2 rounded-md border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 px-2 py-1 text-sm"
                href={`https://www.google.com/maps/dir/?api=1&destination=${officeLat},${officeLng}`}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


