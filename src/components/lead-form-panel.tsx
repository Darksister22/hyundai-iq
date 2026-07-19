"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { IRAQI_GOVERNORATES } from "@/lib/iraqi-governorates";
import type { Locale } from "@/lib/i18n";

export type LeadVariant = "price" | "testDrive";

export interface LeadFormDict {
  requestPriceOffer: string;
  requestTestDrive: string;
  formYourCar: string;
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
  formError: string;
  formClose: string;
}

interface Props {
  open: boolean;
  variant: LeadVariant;
  onClose: () => void;
  locale: Locale;
  modelSlug: string;
  modelName: string;
  modelImage?: string | null;
  dict: LeadFormDict;
}

export default function LeadFormPanel({
  open,
  variant,
  onClose,
  locale,
  modelSlug,
  modelName,
  modelImage,
  dict,
}: Props) {
  const isAr = locale === "ar";
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  const title = variant === "price" ? dict.requestPriceOffer : dict.requestTestDrive;

  // lock background scroll while the panel is open, and close on Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");

    // strip a leading zero before the country code: 07XX… → +9647XX…
    const national = phone.trim().replace(/\D/g, "").replace(/^0+/, "");

    const { error } = await supabase.from("model_leads").insert({
      lead_type: variant,
      model_slug: modelSlug,
      model_name: modelName,
      full_name: name.trim(),
      phone: `+964${national}`,
      email: email.trim() || null,
      city,
      preferred_date: date || null,
      locale,
    });

    setState(error ? "error" : "success");
  };

  const reset = () => {
    setName(""); setPhone(""); setEmail(""); setCity(""); setDate("");
    setState("idle");
  };

  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Desktop: side drawer on the end edge (left in RTL, right in LTR).
          Mobile: bottom sheet. One element, two responsive layouts. */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed z-[80] bg-white shadow-2xl flex flex-col
          inset-x-0 bottom-0 max-h-[90svh] rounded-t-2xl
          md:inset-y-0 md:end-0 md:start-auto md:w-[26rem] md:max-h-none md:rounded-none
          transition-transform duration-300 ease-out
          ${open
            ? "translate-y-0 md:translate-x-0"
            : "translate-y-full md:translate-y-0 md:translate-x-full md:rtl:-translate-x-full"
          }`}
      >
        {/* header */}
        <div className="flex items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-[#111]">{title}</h2>
          <button onClick={onClose} aria-label={dict.formClose} className="p-1 -me-1 text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* car summary */}
          <div className="mb-6">
            {modelImage && (
              <div className="relative w-full aspect-[16/9] mb-3">
                <Image src={modelImage} alt={modelName} fill sizes="26rem" className="object-contain" />
              </div>
            )}
            <p className="text-xs text-gray-400">{dict.formYourCar}</p>
            <p className="text-lg font-bold text-[#111]">{modelName}</p>
          </div>

          {state === "success" ? (
            <div className="py-8 text-center">
              <p className="font-bold text-[#002C5F] mb-4">{dict.formSuccess}</p>
              <button onClick={reset} className="text-sm text-gray-500 underline">
                {isAr ? "إرسال طلب آخر" : "Send another request"}
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Field label={dict.formName} required>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={INPUT} />
              </Field>

              <Field label={dict.formPhone} required>
                <div className="flex items-stretch" dir="ltr">
                  <span className="flex items-center px-3 bg-gray-100 border border-e-0 border-gray-200 rounded-s text-sm text-gray-500">
                    +964
                  </span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    inputMode="tel"
                    className={`${INPUT} rounded-s-none`}
                  />
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
                {/* min = today: no back-dated appointments */}
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className={INPUT}
                />
              </Field>

              {state === "error" && (
                <p className="text-sm text-red-600">{dict.formError}</p>
              )}

              <button
                type="submit"
                disabled={state === "sending"}
                className="mt-2 w-full py-3 rounded-full bg-[#002C5F] text-white text-sm font-semibold hover:bg-[#003d7a] disabled:opacity-60 transition-colors"
              >
                {state === "sending" ? dict.formSubmitting : dict.formSubmit}
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}

const INPUT =
  "w-full px-4 py-2.5 rounded border border-gray-200 bg-gray-50 text-sm text-[#111] focus:outline-none focus:border-[#002C5F] transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-gray-500 mb-1.5">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </span>
      {children}
    </label>
  );
}