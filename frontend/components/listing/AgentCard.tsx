"use client";

import { resolveAssetUrl } from "@/lib/api";
import { trackAgentContactClick } from "@/lib/analytics";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { createBooking } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

import Link from "next/link";

export default function AgentCard({
  id,
  name,
  avatar,
  phone,
  email,
  listingId,
}: {
  id?: string;
  name?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  listingId?: string;
}) {
  const qc = useQueryClient();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", datetime: "", message: "" });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function computeErrors(f = form) {
    const next: Record<string, string> = {};
    const first = (f.firstName || '').trim();
    const last = (f.lastName || '').trim();
    const contactName = `${first} ${last}`.trim();
    if (contactName.length < 2) next.name = t('contact_form.validations.full_name');
    const email = (f.email || '').trim();
    if (!email) next.email = t('contact_form.validations.email');
    const phone = (f.phone || '').trim();
    if (phone.length < 6) next.phone = t('contact_form.validations.phone');
    const dt = (f.datetime || '').trim();
    if (!dt || isNaN(new Date(dt).getTime())) next.datetime = t('agent_card.datetime');
    const msg = (f.message || '').trim();
    if (msg.length > 0 && msg.length < 10) next.message = t('contact_form.validations.message');
    return next;
  }

  const isValid = useMemo(() => Object.keys(errors).length === 0 && Boolean(listingId), [errors, listingId]);
  const agentClickMut = useMutation({
    mutationFn: () => {
      if (listingId) trackAgentContactClick(listingId);
      return Promise.resolve({});
    },
    onMutate: () => {
      qc.setQueryData(['analytics-preview'], (old: any) => ({
        ...(old || {}),
        agentClicks: ((old?.agentClicks ?? 0) + 1),
      }));
    },
  });
  const bookMut = useMutation({
    mutationFn: async () => {
      if (!listingId) throw new Error('Missing listing');
      const first = (form.firstName || '').trim();
      const last = (form.lastName || '').trim();
      const contactName = `${first} ${last}`.trim();
      const email = (form.email || '').trim();
      const phone = (form.phone || '').trim();
      const jsDate = new Date((form.datetime || '').trim());
      const msg = (form.message || '').trim();
      const payload = {
        listingId,
        visitType: 'VIEWING' as const,
        scheduledAt: jsDate.toISOString(),
        duration: 30,
        contactName,
        contactEmail: email,
        contactPhone: phone,
        message: msg ? msg : undefined,
      };
      return createBooking(payload);
    },
    onSuccess: () => {
      setSuccessMsg(t('contact_form.sent'));
      setErrorMsg('');
      setTimeout(() => setOpen(false), 1200);
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || t('contact_form.error_generic'));
    }
  });

  // Recompute validation errors when the form changes
  // and when the modal opens
  React.useEffect(() => {
    setErrors(computeErrors());
  }, [form, open]);
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4">
      <div className="flex items-center gap-3">
        <img
          src={resolveAssetUrl(avatar)}
          alt={name || "Agent"}
          className="h-12 w-12 rounded-full border border-gray-200 object-cover"
        />
        <div>
          <div className="text-gray-900 font-medium">{name || t('agent_card.agent')}</div>
          {email && <div className="text-gray-600 text-sm">{email}</div>}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center justify-between hover:underline"
            onMouseDown={() => agentClickMut.mutate()}
            onClick={() => { /* noop - rely on mousedown to fire before navigation */ }}
          >
            <span className="text-gray-600">{t('contact_form.phone')}</span>
            <span className="text-gray-900">{phone}</span>
          </a>
        )}
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-between hover:underline"
            onMouseDown={() => agentClickMut.mutate()}
            onClick={() => {}}
          >
            <span className="text-gray-600">{t('contact_form.email')}</span>
            <span className="text-gray-900">{email}</span>
          </a>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        {id ? (
          <Link href={`/agents/${id}`} className="w-full inline-flex items-center justify-center bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 py-2">
            {t('agent_card.view_my_property')}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full inline-flex items-center justify-center border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-md px-4 py-2"
        >
          {t('agent_card.book_view')}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-900/50" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-md p-4">
            <div className="text-gray-900 font-semibold text-lg mb-2">{t('agent_card.book_viewing')}</div>
            <div className="grid grid-cols-1 gap-3">
              {successMsg && (
                <div className="border border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 text-sm">
                  {successMsg}
                </div>
              )}
              {errorMsg && (
                <div className="border border-gray-200 rounded-md p-2 bg-gray-50 text-gray-900 text-sm">
                  {errorMsg}
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 w-full" placeholder={t('inquiry.first_name')} value={form.firstName} onChange={(e)=>setForm({...form, firstName:e.target.value})} />
                  {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
                </div>
                <div>
                  <input className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 w-full" placeholder={t('inquiry.last_name')} value={form.lastName} onChange={(e)=>setForm({...form, lastName:e.target.value})} />
                </div>
              </div>
              <div>
                <input className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 w-full" placeholder={t('contact_form.phone')} value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
                {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
              </div>
              <div>
                <input type="email" className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 w-full" placeholder={t('contact_form.email')} value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
                {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
              </div>
              <div>
                <input type="datetime-local" className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 w-full" value={form.datetime} onChange={(e)=>setForm({...form, datetime:e.target.value})} />
                {errors.datetime && <div className="text-xs text-red-600 mt-1">{errors.datetime}</div>}
              </div>
              <div>
                <textarea className="border border-gray-200 rounded-md px-3 py-2 text-gray-900 w-full" placeholder={t('agent_card.message_optional')} value={form.message} onChange={(e)=>setForm({...form, message:e.target.value})} />
                {errors.message && <div className="text-xs text-red-600 mt-1">{errors.message}</div>}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button type="button" className="px-3 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50" onClick={()=>setOpen(false)}>{t('agent_card.cancel')}</button>
                <button type="button" className="px-4 py-2 rounded-md bg-gray-900 hover:bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed" onClick={()=>bookMut.mutate()} disabled={bookMut.isPending || !isValid}>
                  {bookMut.isPending ? t('agent_card.booking') : isValid ? t('agent_card.book_view') : t('agent_card.complete_form')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


