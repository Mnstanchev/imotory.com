"use client";

import Image from "next/image";
import { CheckCircle, Phone, Shield, MapPinned } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AboutClient() {
  const { t, translations } = useLanguage();
  const about = (translations as any).about;
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/HomePage-Image.webp"
            alt="Modern home at sunset"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-28 sm:py-36">
          <h1 className="text-4xl sm:text-5xl font-semibold text-white">{t('about.title')}</h1>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="max-w-3xl">
          <p className="text-gray-900 text-2xl sm:text-3xl leading-snug">{t('about.intro_title')}</p>
          <p className="mt-2 text-gray-700">{t('about.intro_subtitle')}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="text-gray-900 font-semibold">{t('about.mission_title')}</div>
            <p className="mt-2 text-gray-600 text-sm">{t('about.mission_desc')}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="text-gray-900 font-semibold">{t('about.values_title')}</div>
            <p className="mt-2 text-gray-600 text-sm">{t('about.values_desc')}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="text-gray-900 font-semibold">{t('about.vision_title')}</div>
            <p className="mt-2 text-gray-600 text-sm">{t('about.vision_desc')}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
          <Image
            src="/Home2.webp"
            alt="Exterior of a modern home"
            width={1600}
            height={900}
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Experience + Stats */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-gray-900 text-2xl sm:text-3xl font-semibold">{t('about.experience_title')}</h2>
            <p className="mt-3 text-gray-600">{t('about.experience_desc')}</p>
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: t('about.stats.clients'), value: "10K+" },
              { label: t('about.stats.sold'), value: "5K" },
              { label: t('about.stats.professionals'), value: "100+" },
              { label: t('about.stats.satisfaction'), value: "95%" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-gray-200 bg-white p-4 text-center"
              >
                <dt className="text-gray-900 text-xl font-semibold">{s.value}</dt>
                <dd className="text-gray-600 text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Image with floating card */}
      <section className="relative mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <Image
            src="/HomePage-Search-Image.png"
            alt="Team collaborating on property plans"
            width={1600}
            height={900}
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="absolute right-6 -bottom-8 sm:right-10 sm:-bottom-10">
          <div className="w-[280px] sm:w-[320px] rounded-xl border border-gray-200 bg-white shadow-md p-4">
            <div className="text-gray-900 font-semibold">{t('about.floating_card_title')}</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {(about?.floating_points || []).map((item: string) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="bg-gray-50 border-y border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h3 className="text-center text-gray-900 text-xl sm:text-2xl font-semibold">{t('about.trusted_title')}</h3>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(about?.trusted_cards || []).map((f: {title: string; desc: string}) => (
              <div
                key={f.title}
                className="rounded-lg border border-gray-200 bg-white p-5"
              >
                <div className="text-gray-900 font-semibold">{f.title}</div>
                <p className="mt-2 text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Services (added) */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-gray-900 text-2xl font-semibold">{t('about.legal_title')}</h3>
            <p className="mt-3 text-gray-600">{t('about.legal_desc')}</p>
            <ul className="mt-6 space-y-3 text-gray-700">
              {(about?.legal_points || []).map((point: string) => (
                <li key={point} className="flex items-start gap-2">
                  <Shield className="h-5 w-5 text-gray-900" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="/concierge"
                className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                {t('about.legal_cta')}
              </a>
              <a
                href="tel:+359000000000"
                className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50"
              >
                <Phone className="h-4 w-4" /> {t('about.call_us')}
              </a>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-6 bg-white">
            <div className="flex items-start gap-3">
              <MapPinned className="h-5 w-5 text-gray-900" />
              <div>
                <div className="text-gray-900 font-semibold">{t('about.coverage_title')}</div>
                <p className="text-gray-600 text-sm">{t('about.coverage_desc')}</p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-md border border-gray-200">
              <Image
                src="/Home-Page-Image-Search.png"
                alt="Meeting with a notary"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA over image */}
      <section className="relative">
        <div className="absolute inset-0">
          <Image
            src="/HomePage-Image.webp"
            alt="Modern home background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <div className="max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-md">
            <div className="text-gray-900 text-lg font-semibold">{t('about.cta_title')}</div>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {(about?.cta_points || []).map((item: string) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-900" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3">
              <a
                href="/concierge"
                className="rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                {t('about.cta_primary')}
              </a>
              <a
                href="tel:+359000000000"
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-gray-900 hover:bg-gray-50"
              >
                {t('about.cta_secondary')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h3 className="text-center text-gray-900 text-xl sm:text-2xl font-semibold">{t('about.faq_title')}</h3>
        <div className="mt-8 divide-y divide-gray-200 border border-gray-200 rounded-lg">
          {(about?.faq || []).map((item: {q: string; a: string}, idx: number) => (
            <FaqItem key={idx} question={item.q} answer={item.a} />)
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-gray-900 text-lg font-semibold">{t('about.newsletter_title')}</div>
            <p className="mt-1 text-gray-600 text-sm">{t('about.newsletter_subtitle')}</p>
          </div>
          <form className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder={t('about.newsletter_placeholder')}
              className="w-full flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="rounded-md bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
            >
              {t('about.newsletter_submit')}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details className="p-5 group">
      <summary className="list-none cursor-pointer w-full flex items-center justify-between text-left">
        <span className="text-gray-900 font-medium">{question}</span>
        <span className="text-gray-500 group-open:hidden">+</span>
        <span className="text-gray-500 hidden group-open:inline">−</span>
      </summary>
      <p className="mt-3 text-gray-600 text-sm">{answer}</p>
    </details>
  );
}


