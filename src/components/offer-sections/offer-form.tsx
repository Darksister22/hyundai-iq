"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
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
  offerSlug,
  offerOptions,
  dict,
}: {
  locale: Locale;
  /** the sales offer's slug — stored as model_slug on the lead */
  offerSlug: string;
  offerOptions: string[];
  dict: OfferFormDict;
}) {
  const isAr = locale === "ar";
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [offer, setOffer] = useState(offerOptions[0] ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [hp, setHp] = useState(""); // honeypot — bots fill hidden fields

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;

    // honeypot: fake success so bots don't learn they were caught
    if (hp) { setState("success"); return; }

    // Iraqi mobiles: 07XX XXX XXXX → E.164 +9647XXXXXXXX (drop leading 0)
    const national = phone.replace(/\D/g, "").replace(/^0+/, "");
    if (!/^7\d{8,9}$/.test(national)) { setState("error"); return; }

    const cleanEmail = email.trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setState("error"); return;
    }

    setState("sending");

    const { error } = await supabase.from("model_leads").insert({
      lead_type: "offer",         // 0019 added 'offer' to the check constraint
      model_slug: offerSlug,      // the offer this enquiry came from
      model_name: offer,          // the chosen "Offer — Car" label
      full_name: name.trim(),
      phone: `+964${national}`,
      email: cleanEmail || null,
      city,
      preferred_date: date || null,
      locale,
      // status omitted — RLS requires the default 'new'
    });

    if (error) {
      console.error("[model_leads] offer insert failed:", error.message);
      setState("error");
      return;
    }
    setState("success");
  };

  const clearError = () => { if (state === "error") setState("idle"); };

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
        {/* honeypot — hidden from users, irresistible to bots */}
        <input
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <Field label={dict.formOffer} required className="md:col-span-2">
          <select value={offer} onChange={(e) => setOffer(e.target.value)} required className={INPUT}>
            {offerOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field label={dict.formName} required>
          <input value={name} onChange={(e) => { setName(e.target.value); clearError(); }} required className={INPUT} />
        </Field>

        <Field label={dict.formPhone} required>
          <div className="flex items-stretch" dir="ltr">
            <span className="flex items-center px-3 bg-gray-100 border border-e-0 border-gray-200 rounded-s text-sm text-gray-500">+964</span>
            <input value={phone} onChange={(e) => { setPhone(e.target.value); clearError(); }} required inputMode="tel" placeholder="0770 123 4567" className={`${INPUT} rounded-s-none`} />
          </div>
        </Field>

        <Field label={`${dict.formEmail} (${dict.formOptional})`}>
          <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearError(); }} className={INPUT} />
        </Field>

        <Field label={dict.formCity} required>
          <select value={city} onChange={(e) => { setCity(e.target.value); clearError(); }} required className={INPUT}>
            <option value="">{dict.formChoose}</option>
            {IRAQI_GOVERNORATES.map((g) => (
              <option key={g.en} value={g.en}>{isAr ? g.ar : g.en}</option>
            ))}
          </select>
        </Field>

        <Field label={dict.formDate} required>
          <input type="date" value={date} onChange={(e) => { setDate(e.target.value); clearError(); }} required min={new Date().toISOString().split("T")[0]} className={INPUT} />
        </Field>

        {state === "error" && (
          <p role="alert" className="md:col-span-2 text-sm text-red-600">
            {isAr ? "تعذّر الإرسال. تحقّق من رقم الهاتف والبريد الإلكتروني وحاول مرة أخرى." : "Couldn't submit. Check your phone and email, then try again."}
          </p>
        )}

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
