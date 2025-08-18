"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/" className="inline-flex items-center" aria-label={t('nav.brand')}>
                <Image
                  src="/imotory-logo-black.svg"
                  alt={t('nav.brand')}
                  width={140}
                  height={28}
                />
              </Link>
            </div>
            <p className="mt-3 text-gray-600 text-sm">{/* description placeholder optional */}</p>
          </div>
          <div>
            <div className="text-gray-900 font-semibold">{t('footer.explore')}</div>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li><a className="hover:text-gray-900" href="/search-map">{t('footer.map_search')}</a></li>
              <li><a className="hover:text-gray-900" href="/search">{t('footer.browse')}</a></li>
              <li><a className="hover:text-gray-900" href="#featured">{t('footer.featured')}</a></li>
              <li><a className="hover:text-gray-900" href="#latest">{t('footer.latest')}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-gray-900 font-semibold">{t('footer.company')}</div>
            <ul className="mt-3 space-y-2 text-gray-700">
              <li><a className="hover:text-gray-900" href="/concierge">{t('footer.services')}</a></li>
              <li><a className="hover:text-gray-900" href="/about">{t('footer.about')}</a></li>
              <li><a className="hover:text-gray-900" href="#contact">{t('footer.contact')}</a></li>
            </ul>
          </div>
          <div>
            <div className="text-gray-900 font-semibold">{t('footer.stay_updated')}</div>
            <form className="mt-3 flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder={t('footer.email_address')}
                className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="rounded-md bg-gray-900 text-white px-3 py-2 hover:bg-gray-800"
              >
                {t('footer.subscribe')}
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-500">{t('footer.privacy_note')}</p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4 text-gray-700 text-sm">
            <a className="hover:text-gray-900" href="/terms">{t('footer.terms')}</a>
            <span className="text-gray-300">/</span>
            <a className="hover:text-gray-900" href="/privacy">{t('footer.privacy')}</a>
            <span className="text-gray-300">/</span>
            <a className="hover:text-gray-900" href="/cookie-preferences">{t('cookies.manage_link')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


