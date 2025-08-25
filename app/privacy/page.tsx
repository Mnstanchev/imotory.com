"use client";

import { useLanguage } from "@/contexts/language-context";
import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";

// Note: metadata moved to layout or handled differently

export default function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">{t("footer.privacy")}</h1>
        <p className="mt-4 text-gray-700">
          {/* Placeholder privacy text */}
          We care about your privacy. Details about data collection, processing, and rights will be described here.
        </p>
      </div>
    </div>
  );
}


