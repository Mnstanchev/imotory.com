"use client";

import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import ConciergeForm from "@/components/ConciergeForm";
import { Check, FileText, Handshake, Languages, ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";

export default function ConciergePageClient() {
  const { t } = useLanguage();
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
              {t('concierge_page.hero_title')}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-700">
              {t('concierge_page.hero_subtitle')}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5">
                {t('concierge_page.cta_start')}
              </a>
              <Link href="/search" className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 px-5 py-2.5">
                {t('concierge_page.browse_listings')}
              </Link>
            </div>
          </div>
          <div className="relative h-64 md:h-80">
            <div className="absolute inset-0 rounded-xl border border-gray-200 bg-white shadow-xl" />
            <div className="absolute -top-3 -left-3 h-20 w-20 md:h-24 md:w-24 rounded-lg border border-gray-200 bg-white shadow-md flex items-center justify-center">
              <UserRound className="h-8 w-8 text-gray-900" />
            </div>
            <div className="absolute -bottom-3 -right-3 h-20 w-20 md:h-24 md:w-24 rounded-lg border border-gray-200 bg-white shadow-md flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-gray-900" />
            </div>
            {/* Image collage */}
            <div className="absolute inset-6 grid grid-cols-3 gap-3">
              <img
                src="/HomePage-Image.webp"
                alt={t('concierge_page.alt_curated')}
                loading="lazy"
                decoding="async"
                className="col-span-2 h-40 md:h-48 w-full object-cover rounded-lg border border-gray-200 shadow-md bg-white"
              />
              <img
                src="/Home2.webp"
                alt={t('concierge_page.alt_viewings')}
                loading="lazy"
                decoding="async"
                className="h-40 md:h-48 w-full object-cover rounded-lg border border-gray-200 shadow-md bg-white"
              />
              <img
                src="/HomePage-Search-Image.png"
                alt={t('concierge_page.alt_legal')}
                loading="lazy"
                decoding="async"
                className="col-span-1 h-28 md:h-32 w-full object-cover rounded-lg border border-gray-200 shadow-md bg-white"
              />
              <div className="col-span-2 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-gray-200 bg-white shadow-sm p-3 flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900 text-sm">{t('concierge_page.feature_end_to_end')}</span>
                </div>
                <div className="rounded-md border border-gray-200 bg-white shadow-sm p-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900 text-sm">{t('concierge_page.feature_legal_confidence')}</span>
                </div>
                <div className="rounded-md border border-gray-200 bg-white shadow-sm p-3 flex items-center gap-2">
                  <Languages className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900 text-sm">{t('concierge_page.feature_multilingual')}</span>
                </div>
                <div className="rounded-md border border-gray-200 bg-white shadow-sm p-3 flex items-center gap-2">
                  <Check className="h-5 w-5 text-gray-900" />
                  <span className="text-gray-900 text-sm">{t('concierge_page.feature_offmarket')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('concierge_page.different_title')}</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            t('concierge_page.diff_1'),
            t('concierge_page.diff_2'),
            t('concierge_page.diff_3'),
            t('concierge_page.diff_4'),
            t('concierge_page.diff_5'),
            t('concierge_page.diff_6'),
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <Check className="h-5 w-5 text-gray-900 mt-0.5" />
                <p className="text-gray-700">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('concierge_page.how_title')}</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-5">
            {[
              { title: t('concierge_page.step1_title'), desc: t('concierge_page.step1_desc') },
              { title: t('concierge_page.step2_title'), desc: t('concierge_page.step2_desc') },
              { title: t('concierge_page.step3_title'), desc: t('concierge_page.step3_desc') },
              { title: t('concierge_page.step4_title'), desc: t('concierge_page.step4_desc') },
              { title: t('concierge_page.step5_title'), desc: t('concierge_page.step5_desc') },
            ].map((s, i) => (
              <div key={i} className="relative rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded bg-gray-900 text-white flex items-center justify-center text-sm">{i + 1}</div>
                <div className="text-gray-900 font-medium">{s.title}</div>
                <p className="text-gray-600 mt-1 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('concierge_page.core_title')}</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-gray-900 font-semibold text-lg">{t('concierge_page.core_real_estate_title')}</div>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>{t('concierge_page.core_re_1')}</li>
              <li>{t('concierge_page.core_re_2')}</li>
              <li>{t('concierge_page.core_re_3')}</li>
              <li>{t('concierge_page.core_re_4')}</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <div className="text-gray-900 font-semibold text-lg">{t('concierge_page.core_legal_title')}</div>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>{t('concierge_page.core_legal_1')}</li>
              <li>{t('concierge_page.core_legal_2')}</li>
              <li>{t('concierge_page.core_legal_3')}</li>
              <li>{t('concierge_page.core_legal_4')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('concierge_page.addons_title')}</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              t('concierge_page.addons_1'),
              t('concierge_page.addons_2'),
              t('concierge_page.addons_3'),
              t('concierge_page.addons_4'),
            ].map((a, i) => (
              <div key={i} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm text-gray-700">
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('concierge_page.testimonials_title')}</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "M. Ivanov", quote: t('concierge_page.testimonials_q1') },
            { name: "A. Petrova", quote: t('concierge_page.testimonials_q2') },
            { name: "D. Petrov", quote: t('concierge_page.testimonials_q3') },
          ].map((tst, i) => (
            <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-gray-700">"{tst.quote}"</p>
              <div className="mt-3 text-gray-500 text-sm">{tst.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Block */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
            <div className="text-xl md:text-2xl font-semibold text-gray-900">{t('concierge_page.consult_title')}</div>
            <p className="text-gray-600 mt-1">{t('concierge_page.consult_subtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="#contact" className="rounded-full bg-gray-900 text-white hover:bg-gray-800 px-5 py-2.5">{t('concierge_page.consult_request')}</a>
            <a href="https://wa.me/" target="_blank" rel="noreferrer" className="rounded-full border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 px-5 py-2.5">{t('concierge_page.whatsapp')}</a>
            <a href="tel:+359000000000" className="rounded-full border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 px-5 py-2.5">{t('concierge_page.call')}</a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="relative w-full py-14 overflow-hidden">
        {/* Minimalistic BG image (Next.js Image, fills entire section width) */}
        <div className="pointer-events-none select-none absolute inset-0 z-0">
          <Image
            src="/Home2.webp"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            priority={false}
            className="object-cover opacity-90"
            style={{ filter: "grayscale(100%)" }}
          />
        </div>
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('concierge_page.contact_title')}</h2>
            <p className="text-gray-600 mt-2">{t('concierge_page.contact_subtitle')}</p>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>{t('concierge_page.contact_b1')}</li>
              <li>{t('concierge_page.contact_b2')}</li>
              <li>{t('concierge_page.contact_b3')}</li>
            </ul>
          </div>
          <div>
            <ConciergeForm />
          </div>
        </div>
      </section>

      {/* Trust & Credentials */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{t('concierge_page.trust_title')}</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-gray-900 font-medium">{t('concierge_page.trust_card1_title')}</div>
              <p className="text-gray-600 mt-1 text-sm">{t('concierge_page.trust_card1_desc')}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-gray-900 font-medium">{t('concierge_page.trust_card2_title')}</div>
              <p className="text-gray-600 mt-1 text-sm">{t('concierge_page.trust_card2_desc')}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="text-gray-900 font-medium">{t('concierge_page.trust_card3_title')}</div>
              <p className="text-gray-600 mt-1 text-sm">{t('concierge_page.trust_card3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
