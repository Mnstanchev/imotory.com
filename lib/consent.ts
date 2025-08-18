export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export type ConsentState = {
  version: string;
  timestamp: number;
  categories: Record<ConsentCategory, boolean>;
  gpcApplied?: boolean;
};

const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_VERSION = '2025-01';

const DEFAULT_STATE: ConsentState = {
  version: CONSENT_VERSION,
  timestamp: 0,
  categories: {
    necessary: true,
    analytics: false,
    marketing: false,
  },
  gpcApplied: false,
};

function isBrowser() {
  return typeof window !== 'undefined';
}

function writeConsentCookie(state: ConsentState) {
  try {
    const compact = {
      v: state.version,
      a: state.categories.analytics ? 1 : 0,
      m: state.categories.marketing ? 1 : 0,
      ts: state.timestamp,
      g: state.gpcApplied ? 1 : 0,
    } as const;
    const value = encodeURIComponent(JSON.stringify(compact));
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `${CONSENT_STORAGE_KEY}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`;
  } catch {}
}

function readConsentCookie(): Partial<ConsentState> | null {
  try {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const entry = cookies.find((c) => c.startsWith(`${CONSENT_STORAGE_KEY}=`));
    if (!entry) return null;
    const raw = entry.split('=')[1];
    if (!raw) return null;
    const parsed = JSON.parse(decodeURIComponent(raw));
    const result: Partial<ConsentState> = {
      version: parsed.v || CONSENT_VERSION,
      timestamp: Number(parsed.ts) || 0,
      categories: {
        necessary: true,
        analytics: parsed.a === 1,
        marketing: parsed.m === 1,
      } as ConsentState['categories'],
      gpcApplied: parsed.g === 1,
    };
    return result;
  } catch {
    return null;
  }
}

export function isGPCEnabled(): boolean {
  if (!isBrowser()) return false;
  try {
    // @ts-ignore
    return Boolean((navigator as any)?.globalPrivacyControl);
  } catch {
    return false;
  }
}

export function getConsent(): ConsentState {
  if (!isBrowser()) return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      // Try cookie fallback first
      const cookieState = readConsentCookie();
      if (cookieState && cookieState.timestamp) {
        return {
          ...DEFAULT_STATE,
          ...cookieState,
          categories: { ...DEFAULT_STATE.categories, ...(cookieState.categories || {}) },
        };
      }
      const state = { ...DEFAULT_STATE };
      if (isGPCEnabled()) {
        state.categories.analytics = false;
        state.categories.marketing = false;
        state.gpcApplied = true;
      }
      return state;
    }
    const parsed = JSON.parse(raw) as ConsentState;
    // Bump version if outdated
    if (!parsed.version || parsed.version !== CONSENT_VERSION) {
      return {
        ...DEFAULT_STATE,
        categories: {
          ...DEFAULT_STATE.categories,
          // keep user's previous choices when possible
          analytics: Boolean((parsed as any)?.categories?.analytics),
          marketing: Boolean((parsed as any)?.categories?.marketing),
        },
        timestamp: parsed.timestamp || 0,
      };
    }
    return parsed;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === 'necessary') return true;
  const state = getConsent();
  return Boolean(state.categories[category]);
}

type CategoriesPartial = Partial<ConsentState['categories']>;
type ConsentUpdate = (Partial<Omit<ConsentState, 'categories'>> & { categories?: CategoriesPartial }) | CategoriesPartial;

export function setConsent(update: ConsentUpdate): ConsentState {
  if (!isBrowser()) return { ...DEFAULT_STATE };
  const current = getConsent();
  const categoriesOnly = 'necessary' in (update as any) || 'analytics' in (update as any) || 'marketing' in (update as any);
  let categories: ConsentState['categories'];
  if (categoriesOnly) {
    categories = { ...current.categories, ...(update as CategoriesPartial) } as ConsentState['categories'];
  } else {
    const up = update as Partial<Omit<ConsentState, 'categories'>> & { categories?: CategoriesPartial };
    categories = { ...current.categories, ...(up.categories ?? {}) } as ConsentState['categories'];
  }
  const next: ConsentState = {
    version: CONSENT_VERSION,
    timestamp: Date.now(),
    categories,
    gpcApplied: current.gpcApplied,
  };
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
  } catch {}
  try {
    writeConsentCookie(next);
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent('consentchange', { detail: next }));
  } catch {}
  return next;
}

export function openConsentPreferences(): void {
  if (!isBrowser()) return;
  try {
    window.dispatchEvent(new CustomEvent('open-consent-preferences'));
  } catch {}
}


