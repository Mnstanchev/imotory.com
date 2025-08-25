import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('terms', 'bg');
}

"use client";

import { useLanguage } from "@/contexts/language-context";

export default function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">{t("footer.terms")}</h1>
        <p className="mt-4 text-gray-700">
          {/* Placeholder legal text */}
          {t("footer.terms")} — {""}
          {t("footer.privacy")} and cookie usage information will be outlined here. This is placeholder content.
        </p>
      </div>
    </div>
  );
}


