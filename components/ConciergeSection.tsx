type ConciergeProps = {
  backgroundUrl?: string;
  images?: [string, string, string, string];
  onContactClick?: () => void;
};

import { useLanguage } from "@/contexts/language-context";

export default function ConciergeSection({
  backgroundUrl = "",
  images = [
    "/test.jpg",
    "/test2.jpg",
    "/test3.jpg",
    "/test4.jpg",
  ],
  onContactClick,
}: ConciergeProps) {
  const { t } = useLanguage();
  const encodedBackgroundUrl = encodeURI(backgroundUrl);
  return (
    <section
      id="services"
      className="border-t border-gray-200"
      style={
        backgroundUrl
          ? {
              backgroundImage: `url(${encodedBackgroundUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Headline & CTA */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-sm text-gray-500">Reason to Choose Us</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6">
            {t('concierge_page.hero_title')}
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-8 max-w-xl">
            {t('about.legal_desc')}
          </p>
          <div className="flex items-center gap-3">
            <a
              href="/concierge"
              className="inline-flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-800 rounded-full px-5 py-2.5 shadow-sm"
            >
              {t('concierge.contact')}
            </a>
            <button
              type="button"
              onClick={onContactClick}
              className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-full px-5 py-2.5 shadow-sm"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Right: Legal‑focused cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card: Legal Confidence with faux search */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md">
            <div className="mb-4">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white text-gray-500 px-3 py-2 shadow-sm">
                <span className="text-gray-400">🔍</span>
                <span className="text-sm">Search legal checks</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('concierge_page.feature_legal_confidence')}</h3>
            <p className="text-gray-600 text-sm">{t('concierge_page.core_legal_1')}. {t('concierge_page.core_legal_2')}.</p>
          </div>

          {/* Card: Licensed & Trusted */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md">
            <div className="mb-3">
              <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-gray-900">
                <span className="text-white">✓</span>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Licensed & Trusted</h3>
            <p className="text-gray-600 text-sm">{t('concierge_page.trust_card1_title')} · {t('concierge_page.trust_card3_title')}</p>
          </div>

          {/* Bottom: Compliance & image card */}
          <div className="sm:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-md relative overflow-hidden md:pr-64">
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Compliance & Privacy</h3>
              <p className="text-gray-600 text-sm mb-6 max-w-xl">Contract, KYC and GDPR‑aware workflows · Tax & fees guidance</p>
            </div>

            {/* Stacked photo preview on the right */}
            <div className="absolute right-4 bottom-4 hidden md:block z-0">
              <div className="relative">
                <div className="absolute -left-6 top-4 rotate-[-6deg] h-28 w-40 bg-white border border-gray-200 rounded-xl shadow-md" />
                <div className="relative h-32 w-48 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                  <img src={images[0]} alt="preview" className="h-full w-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 border-t border-gray-200 p-2">
                    <div className="text-xs text-gray-900 font-medium">Modern Architectural Marvel</div>
                    <div className="text-[10px] text-gray-500">Catonsville, MD</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


