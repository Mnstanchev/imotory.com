"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

export default function ConciergeForm() {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("Buy");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [bestTime, setBestTime] = useState("Anytime");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);
    try {
      if (!name.trim() || !email.trim()) throw new Error(t('concierge_form.error_required'));
      const payload = {
        name,
        email,
        phone: phone || undefined,
        subject: `[Concierge] ${purpose} • ${budget || "No budget"} • ${location || "No location"}`,
        message: `Purpose: ${purpose}\nBudget: ${budget}\nPreferred location: ${location}\nBest time: ${bestTime}`,
      };
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(t('concierge_form.request_failed'));
      setOk(t('concierge_form.success'));
      setName("");
      setEmail("");
      setPhone("");
      setPurpose("Buy");
      setBudget("");
      setLocation("");
      setBestTime("Anytime");
    } catch (e: any) {
      setErr(e?.message || t('concierge_form.failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-md shadow-sm p-4 space-y-3">
      <div className="text-gray-900 font-medium">{t('concierge_form.title')}</div>
      <p className="text-gray-600 text-sm">{t('concierge_form.subtitle')}</p>

      {ok && <div className="border border-gray-200 bg-gray-50 text-gray-900 rounded-md px-3 py-2">{ok}</div>}
      {err && <div className="text-sm text-red-600">{err}</div>}

      <label className="text-sm text-gray-700">{t('contact_form.full_name')}
        <input className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('contact_form.full_name_ph')} value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label className="text-sm text-gray-700">{t('contact_form.email')}
        <input type="email" className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('contact_form.email_ph')} value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>

      <label className="text-sm text-gray-700">{t('contact_form.phone')}
        <input className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('contact_form.phone_ph')} value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm text-gray-700">{t('concierge_form.purpose_label')}
          <select className="mt-1 w-full border border-gray-200 rounded px-3 py-2 bg-white" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
            <option>{t('concierge_form.purpose_buy')}</option>
            <option>{t('concierge_form.purpose_sell')}</option>
            <option>{t('concierge_form.purpose_rent')}</option>
            <option>{t('concierge_form.purpose_legal')}</option>
          </select>
        </label>
        <label className="text-sm text-gray-700">{t('concierge_form.budget_label')}
          <input className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('concierge_form.budget_ph')} value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
      </div>

      <label className="text-sm text-gray-700">{t('concierge_form.location_label')}
        <input className="mt-1 w-full border border-gray-200 rounded px-3 py-2" placeholder={t('concierge_form.location_ph')} value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>

      <label className="text-sm text-gray-700">{t('concierge_form.best_time_label')}
        <select className="mt-1 w-full border border-gray-200 rounded px-3 py-2 bg-white" value={bestTime} onChange={(e) => setBestTime(e.target.value)}>
          <option>{t('concierge_form.best_anytime')}</option>
          <option>{t('concierge_form.best_morning')}</option>
          <option>{t('concierge_form.best_afternoon')}</option>
          <option>{t('concierge_form.best_evening')}</option>
        </select>
      </label>

      <button type="submit" disabled={submitting} className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 py-2">
        {submitting ? t('concierge_form.sending') : t('concierge_form.submit')}
      </button>
    </form>
  );
}


