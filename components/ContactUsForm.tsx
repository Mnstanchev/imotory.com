"use client";

import { useState } from "react";
import { API_BASE } from "@/lib/api";
import { useLanguage } from "@/contexts/language-context";

export default function ContactUsForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      if (name.trim().length < 2) throw new Error("Please enter your name");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Please enter a valid email");
      if (message.trim().length < 5) throw new Error("Please enter a short message");

      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, subject: "Website Contact" }),
      });
      if (!res.ok) {
        let detail = "Failed to send message";
        try {
          const j = await res.json();
          detail = j?.message || j?.error || detail;
        } catch {}
        throw new Error(detail);
      }
      setSent(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-md shadow-sm p-5 space-y-4">
      <div className="text-gray-900 font-medium">Send us a message</div>

      {sent ? (
        <div className="border border-gray-200 bg-gray-50 text-gray-900 rounded-md px-3 py-2">Thanks! We'll get back to you shortly.</div>
      ) : null}

      <div>
        <label className="text-sm text-gray-900">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="mt-1 w-full border border-gray-200 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-900">Your Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@business.com"
          className="mt-1 w-full border border-gray-200 rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-900">Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 222 333 4444"
          className="mt-1 w-full border border-gray-200 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm text-gray-900">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I need help with ..."
          rows={5}
          className="mt-1 w-full border border-gray-200 rounded px-3 py-2"
          required
        />
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <button disabled={sending} className="w-full bg-gray-900 text-white hover:bg-gray-800 rounded-md px-4 py-2">
        {sending ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}


