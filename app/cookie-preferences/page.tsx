import type { Metadata } from "next";
import { generatePageMetadata } from "../../lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('cookiePreferences', 'bg');
}

"use client";

import { useLanguage } from "@/contexts/language-context";
import { openConsentPreferences } from "@/lib/consent";

export default function CookiePreferencesPage() {
  const { t } = useLanguage();
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">{t("cookies.modal_title")}</h1>
        <p className="mt-4 text-gray-700">{t("cookies.modal_description")}</p>
        <button
          type="button"
          className="mt-6 rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
          onClick={() => openConsentPreferences()}
        >
          {t("cookies.preferences")}
        </button>
      </div>
    </div>
  );
}


