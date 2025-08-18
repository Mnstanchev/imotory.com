"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { ConsentState, getConsent, hasConsent, isGPCEnabled, setConsent } from "@/lib/consent";

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [openPrefs, setOpenPrefs] = useState(false);
  const [state, setState] = useState<ConsentState | null>(null);

  const gpc = useMemo(() => isGPCEnabled(), []);

  useEffect(() => {
    const current = getConsent();
    setState(current);
    // Show banner only if user hasn't acted (timestamp 0)
    if (!current.timestamp) setVisible(true);

    function onOpen() {
      setOpenPrefs(true);
      setVisible(false);
    }
    function onChange(e: any) {
      setState(e.detail as ConsentState);
    }
    window.addEventListener('open-consent-preferences', onOpen as any);
    window.addEventListener('consentchange', onChange as any);
    return () => {
      window.removeEventListener('open-consent-preferences', onOpen as any);
      window.removeEventListener('consentchange', onChange as any);
    };
  }, []);

  if (!state) return null;
  const showBanner = visible && !state.timestamp;

  return (
    <>
      {showBanner ? (
        <div className="fixed inset-x-0 bottom-0 z-50">
          <div className="mx-auto max-w-7xl px-4 pb-4">
            <div className="rounded-md bg-white border border-gray-200 shadow-md p-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700">
                <p className="text-gray-900 font-medium">{t('cookies.title')}</p>
                <p className="mt-1 text-gray-600">{t('cookies.description')}</p>
                {gpc ? (
                  <p className="mt-1 text-xs text-gray-500">{t('cookies.gpc_active')}</p>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const next = setConsent({ categories: { necessary: true, analytics: true, marketing: false } });
                    setState(next);
                    setVisible(false);
                  }}
                  className="rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 px-2.5 py-1.5 text-xs cursor-pointer"
                >
                  {t('cookies.accept_all')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const next = setConsent({ categories: { necessary: true, analytics: false, marketing: false } });
                    setState(next);
                    setVisible(false);
                  }}
                  className="rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 px-2.5 py-1.5 text-xs cursor-pointer"
                >
                  {t('cookies.reject_all')}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenPrefs(true)}
                  className="rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 px-2.5 py-1.5 text-xs cursor-pointer"
                >
                  {t('cookies.preferences')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {openPrefs ? (
        <PreferencesModal
          initialState={state}
          onClose={() => setOpenPrefs(false)}
          onSave={(categories) => {
            const next = setConsent({ categories: { necessary: true, analytics: !!categories.analytics, marketing: !!categories.marketing } });
            setState(next);
            setOpenPrefs(false);
            setVisible(false);
          }}
        />
      ) : null}
    </>
  );
}

function PreferencesModal({
  initialState,
  onClose,
  onSave,
}: {
  initialState: ConsentState;
  onClose: () => void;
  onSave: (categories: Partial<ConsentState['categories']>) => void;
}) {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<boolean>(hasConsent('analytics'));
  const [marketing, setMarketing] = useState<boolean>(hasConsent('marketing'));
  const gpc = useMemo(() => isGPCEnabled(), []);

  useEffect(() => {
    setAnalytics(initialState.categories.analytics);
    setMarketing(initialState.categories.marketing);
  }, [initialState]);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-gray-900/50" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white border border-gray-200 shadow-xl rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-gray-900 font-semibold">{t('cookies.modal_title')}</h2>
            <button onClick={onClose} className="text-gray-700 hover:text-gray-900 cursor-pointer">{t('cookies.close')}</button>
          </div>
          <p className="mt-2 text-sm text-gray-600">{t('cookies.modal_description')}</p>
          {gpc ? (
            <p className="mt-2 text-xs text-gray-500">{t('cookies.gpc_active')}</p>
          ) : null}

          <div className="mt-4 space-y-3">
            <CategoryRow
              title={t('cookies.categories.necessary')}
              description={t('cookies.categories.necessary_desc')}
              checked
              disabled
            />
            <CategoryRow
              title={t('cookies.categories.analytics')}
              description={t('cookies.categories.analytics_desc')}
              checked={analytics}
              onChange={setAnalytics}
              disabled={gpc}
            />
            <CategoryRow
              title={t('cookies.categories.marketing')}
              description={t('cookies.categories.marketing_desc')}
              checked={marketing}
              onChange={setMarketing}
              disabled={gpc}
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button onClick={onClose} className="rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 px-3 py-2 text-sm">{t('cookies.cancel')}</button>
            <button
              onClick={() => onSave({ analytics, marketing })}
              className="rounded-md bg-gray-900 text-white px-3 py-2 text-sm hover:bg-gray-800"
            >
              {t('cookies.save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  title,
  description,
  checked,
  onChange,
  disabled,
}: {
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        className="mt-1 cursor-pointer"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <div>
        <div className="text-gray-900 font-medium">
          {title}
          {disabled ? <span className="ml-1 text-xs text-gray-500">({"GPC"})</span> : null}
        </div>
        <div className="text-gray-600 text-sm">{description}</div>
      </div>
    </div>
  );
}


