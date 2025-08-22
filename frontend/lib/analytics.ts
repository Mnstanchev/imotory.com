import { API_BASE } from './api';
import { hasConsent } from './consent';

type EventType = 'LISTING_CLICK' | 'AGENT_CONTACT_CLICK' | 'CONTACT_SUBMIT';

const sentRecently: Record<string, number> = {};
const DEDUPE_WINDOW_MS = 10_000; // match backend debounce window

function shouldSend(key: string): boolean {
  const now = Date.now();
  const last = sentRecently[key] || 0;
  if (now - last < DEDUPE_WINDOW_MS) return false;
  sentRecently[key] = now;
  return true;
}

export function logAnalyticsEvent(listingId: string, type: EventType) {
  // Respect consent for analytics events
  if (!hasConsent('analytics')) return;
  if (!listingId) return;
  const key = `${listingId}:${type}`;
  if (!shouldSend(key)) return;

  const url = `${API_BASE}/listings/${listingId}`;
  const payload = JSON.stringify({ type });

  try {
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      const blob = new Blob([payload], { type: 'application/json' });
      (navigator as any).sendBeacon(url, blob);
    }
  } catch {}

  // Keepalive fetch fallback and secondary assurance
  try {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      // @ts-ignore
      keepalive: true,
      cache: 'no-store',
      mode: 'cors',
    }).catch(() => {});
  } catch {}
}

export const trackListingClick = (listingId: string) => logAnalyticsEvent(listingId, 'LISTING_CLICK');
export const trackAgentContactClick = (listingId: string) => logAnalyticsEvent(listingId, 'AGENT_CONTACT_CLICK');
export const trackContactSubmit = (listingId: string) => logAnalyticsEvent(listingId, 'CONTACT_SUBMIT');

// Guest favorites: fire-and-forget log carrying a Sofia time string.
// We reuse the listings POST endpoint to avoid auth, attaching extra fields the backend safely ignores.
export function trackGuestFavorite(listingId: string, sofiaTime: string) {
  if (!listingId) return;
  const key = `${listingId}:GUEST_FAVORITE`;
  if (!shouldSend(key)) return;

  const url = `${API_BASE}/favorites/guest`;
  const payload = JSON.stringify({ listingId, sofiaTime });

  try {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      // @ts-ignore
      keepalive: true,
      cache: 'no-store',
      mode: 'cors',
    }).catch(() => {});
  } catch {}
}


