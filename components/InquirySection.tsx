"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

type Props = {
  imageUrl: string;
};

export default function InquirySection({ imageUrl }: Props) {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    intent: t('inquiry.buy'),
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const encodedImageUrl = encodeURI(imageUrl);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setOk(null);
    setErr(null);
    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: `${form.firstName.toLowerCase() || "user"}@example.com`, // placeholder email to satisfy backend schema
        phone: form.phone || undefined,
        subject: form.intent,
        message: form.message,
      };
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      setOk(t('inquiry.thank_you'));
      setForm({ firstName: "", lastName: "", phone: "", intent: t('inquiry.buy'), message: "" });
    } catch (e) {
      setErr(t('inquiry.failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 items-stretch gap-0 mt-5">
      <div className="overflow-hidden border border-gray-200 hidden md:block h-full">
        <img src={encodedImageUrl} alt="Inquiry" className="w-full h-full object-cover" />
      </div>
      <form onSubmit={onSubmit} className="bg-white text-gray-900 border border-gray-200">
        <div className="px-4 md:px-5 pt-4 md:pt-5 pb-2">
          <h2 className="text-lg md:text-xl font-semibold mb-2">{t('concierge.title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-gray-600 text-xs">{t('inquiry.first_name')}</label>
              <input
                className="mt-1 w-full rounded-md bg-white text-gray-900 border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder={t('inquiry.first_name')}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-gray-600 text-xs">{t('inquiry.last_name')}</label>
              <input
                className="mt-1 w-full rounded-md bg-white text-gray-900 border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder={t('inquiry.last_name')}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="mb-2">
            <label className="text-gray-600 text-xs">{t('inquiry.phone')}</label>
            <input
              className="mt-1 w-full rounded-md bg-white text-gray-900 border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder={t('inquiry.phone')}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="mb-2">
            <label className="text-gray-600 text-xs">{t('inquiry.i_want')}</label>
            <select
              className="mt-1 w-full rounded-md bg-white text-gray-900 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={form.intent}
              onChange={(e) => setForm({ ...form, intent: e.target.value })}
            >
              <option>{t('inquiry.buy')}</option>
              <option>{t('inquiry.rent')}</option>
              <option>{t('inquiry.other')}</option>
            </select>
          </div>

          <div className="mb-0">
            <label className="text-gray-600 text-xs">{t('inquiry.notes')}</label>
            <textarea
              className="mt-1 w-full rounded-md bg-white text-gray-900 border border-gray-300 px-3 py-1.5 h-14 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200"
              placeholder={t('inquiry.write_message')}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </div>
          <div className="mt-2">
          {ok && <p className="text-gray-600 text-xs mb-2">{ok}</p>}
          {err && <p className="text-red-500 text-xs mb-2">{err}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-gray-900 text-white hover:bg-gray-800 px-6 py-2 font-medium disabled:opacity-50"
          >
            {submitting ? t('inquiry.sending') : t('inquiry.submit')}
          </button>
          </div>
        </div>
      </form>
    </section>
  );
}


