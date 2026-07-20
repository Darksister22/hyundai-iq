"use client";

import { useState } from "react";
import { IRAQI_GOVERNORATES } from "@/lib/iraqi-governorates";
import type { Locale } from "@/lib/i18n";

export interface OfferFormDict {
  formTitle: string;
  formOffer: string;
  formName: string;
  formPhone: string;
  formEmail: string;
  formOptional: string;
  formCity: string;
  formChoose: string;
  formDate: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccess: string;
}

export default function OfferForm({
  locale,
  offerOptions,
  dict,
}: {
  locale: Locale;
  offerOptions: string[];
  dict: OfferFormDict;
}) {
  const isAr = locale === "ar";
  const [state, setState] = useState<"idle" | "sending" | "success">("idle");
  const [offer, setOffer] = useState(offerOptions[0] ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  // NOT wired to Supabase yet — simulates a round-trip so the UI can be reviewed.
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    setTimeout(() => setState("success"), 600);
  };

  if (state === "success") {
    return (
      <div className="rounded-2xl bg-gray-50 px-6 py-16 text-center">
        <p className="font-bold text-[#002C5F]">{dict.formSuccess}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gray-50 px-6 py-10 md:px-10">
      <h3 className="text-xl md:text-2xl font-bold text-[#111] mb-8">{dict.formTitle}</h3>

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={dict.formOffer} required className="md:col-span-2">
          <select value={offer} onChange={(e) => setOffer(e.target.value)} required className={INPUT}>
            {offerOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label={dict.formName} required>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={INPUT} />
        </Field>

        <Field label={dict.formPhone} required>
          <div className="flex items-stretch" dir="ltr">
            <span className="flex items-center px-3 bg-gray-100 border border-e-0 border-gray-200 rounded-s text-sm text-gray-500">+964</span>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} required inputMode="tel" placeholder="0770 123 4567" className={`${INPUT} rounded-s-none`} />
          </div>
        </Field>

        <Field label={`${dict.formEmail} (${dict.formOptional})`}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT} />
        </Field>

        <Field label={dict.formCity} required>
          <select value={city} onChange={(e) => setCity(e.target.value)} required className={INPUT}>
            <option value="">{dict.formChoose}</option>
            {IRAQI_GOVERNORATES.map((g) => (
              <option key={g.en} value={g.en}>{isAr ? g.ar : g.en}</option>
            ))}
          </select>
        </Field>

        <Field label={dict.formDate} required>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required min={new Date().toISOString().split("T")[0]} className={INPUT} />
        </Field>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={state === "sending"}
            className="w-full md:w-auto px-10 py-3 rounded-full bg-[#002C5F] text-white text-sm font-semibold hover:bg-[#003d7a] disabled:opacity-60 transition-colors"
          >
            {state === "sending" ? dict.formSubmitting : dict.formSubmit}
          </button>
        </div>
      </form>
    </div>
  );
}

const INPUT =
  "w-full px-4 py-2.5 rounded border border-gray-200 bg-white text-sm text-[#111] focus:outline-none focus:border-[#002C5F] transition-colors";

function Field({ label, required, className = "", children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs text-gray-500 mb-1.5">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </span>
      {children}
    </label>
  );
}