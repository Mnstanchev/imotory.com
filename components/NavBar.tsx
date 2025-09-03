"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { Globe, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function NavBar() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center" aria-label={t('nav.brand')}>
              <Image
                src="/imotory-logo-black.svg"
                alt={t('nav.brand')}
                width={140}
                height={28}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-6 text-gray-700">
              <a className="hover:text-gray-900" href="/search-map">{t('nav.explore')}</a>
              <a className="hover:text-gray-900" href="/about">{t('nav.about')}</a>
              <a className="hover:text-gray-900" href="/concierge">{t('nav.concierge')}</a>
              <a className="hover:text-gray-900" href="/contact">{t('nav.contact')}</a>
            </nav>
            
            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden inline-flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 p-2"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="ml-0">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Navigation Links */}
            <nav className="px-4 py-6">
              <div className="space-y-1">
                <a 
                  href="/search-map"
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.explore')}
                </a>
                <a 
                  href="/about"
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.about')}
                </a>
                <a 
                  href="/concierge"
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.concierge')}
                </a>
                <a 
                  href="/contact"
                  className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('nav.contact')}
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function LanguageSwitcher() {
  const { currentLanguage, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const languages = [
    { code: 'bg', label: t('languages.bg') },
    { code: 'en', label: t('languages.en') },
    { code: 'ru', label: t('languages.ru') },
  ] as const;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('languages.select')}
        className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 p-2"
      >
        <Globe className="w-5 h-5" />
      </button>
      {open ? (
        <div
          role="menu"
          aria-label={t('languages.select')}
          className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md py-1 z-50"
        >
          {languages.map((lng) => (
            <button
              key={lng.code}
              role="menuitemradio"
              aria-checked={currentLanguage === lng.code}
              onClick={() => {
                setLanguage(lng.code as any);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-50 hover:text-gray-900 ${
                currentLanguage === lng.code ? 'bg-gray-100 text-gray-900' : ''
              }`}
            >
              {lng.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}


