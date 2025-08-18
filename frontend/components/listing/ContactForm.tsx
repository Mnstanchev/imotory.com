"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { API_BASE } from "@/lib/api";
import { trackContactSubmit } from "@/lib/analytics";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function ContactForm({
  listingId,
  agentId,
  propertyTitle,
  displayId,
}: {
  listingId?: string;
  agentId?: string;
  propertyTitle?: string | Record<string, string>;
  displayId?: string; // e.g. #1000123
}) {
  const { t, currentLanguage } = useLanguage();
  const qc = useQueryClient();
  const submitClickMut = useMutation({
    mutationFn: () => {
      if (listingId) trackContactSubmit(listingId);
      return Promise.resolve({});
    },
    onMutate: () => {
      qc.setQueryData(['analytics-preview'], (old: any) => ({
        ...(old || {}),
        contactSubmits: ((old?.contactSubmits ?? 0) + 1),
      }));
    }
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<"buy" | "rent">("buy");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      // simple client-side validation mirroring backend
      if (name.trim().length < 2) throw new Error(t('contact_form.validations.full_name'));
      if (email.trim().length === 0) throw new Error(t('contact_form.validations.email'));
      if (phone && phone.trim() && phone.trim().length < 6) throw new Error(t('contact_form.validations.phone'));
      if (message.trim().length < 10) throw new Error(t('contact_form.validations.message'));

      const propertyTitleText = typeof propertyTitle === 'string' ? propertyTitle : (propertyTitle?.[currentLanguage] || (propertyTitle as any)?.en || (propertyTitle as any)?.bg || (propertyTitle as any)?.ru || '');
      const subjectLine = `${displayId ? `${displayId} · ` : ""}${propertyTitleText || t('contact_form.subject.property')} — ${
        interest === "rent" ? t('contact_form.subject.rent_inquiry') : t('contact_form.subject.buy_inquiry')
      }`;

      const payload: any = {
        name,
        email,
        phone,
        subject: subjectLine,
        message,
      };
      if (listingId) payload.listingId = listingId;
      if (agentId) payload.agentId = agentId;

      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        let detail = t('contact_form.validations.failed');
        try {
          const j = await res.json();
          detail = j?.message || j?.error || detail;
        } catch {}
        throw new Error(detail);
      }
      setSent(true);
      submitClickMut.mutate();
      setName("");
      setPhone("");
      setEmail("");
      setInterest("buy");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || t('contact_form.error_generic'));
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-md shadow-sm p-4 space-y-3">
      <div className="text-gray-900 font-medium">{t('contact_form.schedule_tour')}</div>
      <p className="text-gray-600 text-sm">{t('contact_form.subtitle')}</p>

      {sent && (
        <div className="border border-gray-200 bg-gray-50 text-gray-900 rounded-md px-3 py-2">
          {t('contact_form.sent')}
        </div>
      )}

      {/* Property ID and Property Name are intentionally not shown; they are passed in the payload */}

      <label className="text-sm text-gray-700">{t('contact_form.full_name')}
        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('contact_form.full_name_ph')} required />
      </label>

      <label className="text-sm text-gray-700">{t('contact_form.phone')}
        <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('contact_form.phone_ph')} />
      </label>

      <label className="text-sm text-gray-700">{t('contact_form.email')}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('contact_form.email_ph')} required />
      </label>

      <label className="text-sm text-gray-700">{t('contact_form.interested_in')}
        <select value={interest} onChange={(e) => setInterest(e.target.value as any)} className="mt-1 w-full border border-gray-200 rounded px-3 py-2 bg-white">
          <option value="buy">{t('contact_form.buy')}</option>
          <option value="rent">{t('contact_form.rent')}</option>
        </select>
      </label>

      <label className="text-sm text-gray-700">{t('contact_form.message')}
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('contact_form.message_ph')} rows={4} />
      </label>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <button disabled={sending} className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 py-2">
        {sending ? t('inquiry.sending') : sent ? 'Sent' : 'Send message'}
      </button>
    </form>
  );
}


