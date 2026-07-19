"use client";
// components/service-booking-form.tsx
// Booking Information → Vehicle Information → Your Information → consent → Submit
// Submits into public.service_bookings via the site's singleton supabase client.
// Styling matches components/contact-form.tsx (inputCls, Field labels, navy
// submit, card wrapper) for visual consistency across the site's forms.

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IRAQI_GOVERNORATES } from "@/lib/iraqi-governorates";
import type { Locale } from "@/lib/i18n";

export interface BookingFormDict {
  bookingInfo: string;
  serviceType: string;
  select: string;
  serviceEnquiry: string;
  periodicMaintenance: string;
  recall: string;
  technicalFaults: string;
  userCity: string;
  selectCity: string;
  preferredTime: string;
  satWed: string;
  satWedHours: string;
  thu: string;
  thuHours: string;
  vehicleInfo: string;
  vehicle: string;
  selectModel: string;
  manufacturingYear: string;
  selectYear: string;
  vin: string;
  plateNumbers: string;
  plateLetter: string;
  mileage: string;
  yourInfo: string;
  gender: string;
  male: string;
  female: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  privacyText: string;
  readMore: string;
  readLess: string;
  agreeCommercial: string;
  agreePrivacy: string;
  privacyPolicy: string;
  submit: string;
  submitting: string;
  successMsg: string;
  errorMsg: string;
  requiredMsg: string;
}

interface ServiceBookingFormProps {
  locale: Locale;
  dict: BookingFormDict;
  /** car models fetched server-side: English name as value, localized label */
  carModels: { value: string; label: string }[];
}

// shared input styling — identical to contact-form.tsx's inputCls
const inputCls =
  "w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#00AAD2] transition-colors";

/* ------------------------------------------------------------------ */
/* Label + required-asterisk wrapper — same as contact form's Field    */
/* ------------------------------------------------------------------ */
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm text-gray-600 mb-2">
      {label}
      {required && <span className="text-red-500 ms-0.5">*</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Custom dropdown — trigger styled like inputCls, panel kept flat     */
/* ------------------------------------------------------------------ */
interface Option {
  value: string;
  label: string;
}

function Select({
  label,
  required,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div>
      <FieldLabel label={label} required={required} />
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`${inputCls} flex items-center justify-between bg-white text-start ${
            selected ? "text-gray-900" : "text-gray-500"
          }`}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`shrink-0 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-20 top-full mt-1 w-full max-h-72 overflow-auto bg-white rounded border border-gray-200 shadow-lg">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false); }}
                className={`block w-full px-4 py-3 text-start text-sm transition-colors hover:bg-gray-100 ${
                  o.value === value ? "bg-gray-100 text-gray-900" : "text-gray-700"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Text input                                                          */
/* ------------------------------------------------------------------ */
function TextInput({
  label,
  required,
  type = "text",
  value,
  onChange,
  inputMode,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "numeric" | "text" | "email" | "tel";
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                */
/* ------------------------------------------------------------------ */
export default function ServiceBookingForm({ locale, dict, carModels }: ServiceBookingFormProps) {
  const isAr = locale === "ar";

  const [serviceType, setServiceType] = useState("");
  const [city, setCity] = useState("");
  const [preferredTime, setPreferredTime] = useState<"sat_wed" | "thu">("sat_wed");
  const [carModel, setCarModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [plateLetter, setPlateLetter] = useState("");
  const [mileage, setMileage] = useState("");
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [agreeCommercial, setAgreeCommercial] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error" | "invalid">("idle");

  const serviceTypeOptions: Option[] = [
    { value: "service_enquiry",      label: dict.serviceEnquiry },
    { value: "periodic_maintenance", label: dict.periodicMaintenance },
    { value: "recall",               label: dict.recall },
    { value: "technical_faults",     label: dict.technicalFaults },
  ];

  const cityOptions: Option[] = IRAQI_GOVERNORATES.map((g) => ({
    value: g.en,                                   // DB stores the english key
    label: locale === "ar" ? g.ar : g.en,
  }));

  const yearOptions: Option[] = Array.from({ length: 2026 - 2010 + 1 }, (_, i) => {
    const y = String(2026 - i);
    return { value: y, label: y };
  });

  const modelOptions: Option[] = carModels;

  const genderOptions: Option[] = [
    { value: "male",   label: dict.male },
    { value: "female", label: dict.female },
  ];

  const timeCards = [
    { value: "sat_wed" as const, day: dict.satWed, hours: dict.satWedHours },
    { value: "thu" as const,     day: dict.thu,    hours: dict.thuHours },
  ];

  const valid =
    serviceType && city && carModel && year &&
    firstName.trim() && lastName.trim() && email.trim() && phone.trim() &&
    agreePrivacy;

  const handleSubmit = async () => {
    if (!valid) { setState("invalid"); return; }
    setState("submitting");
    const { error } = await supabase.from("service_bookings").insert({
      service_type: serviceType,
      city,
      preferred_time: preferredTime,
      car_model: carModel,
      manufacturing_year: Number(year),
      vin: vin.trim() || null,
      plate_number: plateNumber.trim() || null,
      plate_letter: plateLetter.trim() || null,
      mileage: mileage.trim() ? Number(mileage) : null,
      gender: gender || null,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone: `+964${phone.trim()}`,
      agree_commercial: agreeCommercial,
    });
    setState(error ? "error" : "success");
  };

  if (state === "success") {
    // success card — mirrors the contact form's success state
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00AAD2]/10 text-[#00AAD2] text-2xl">
          ✓
        </div>
        <p className="text-[#002C5F] font-semibold">{dict.successMsg}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8">
      {/* ---------------- Booking Information ---------------- */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-5">{dict.bookingInfo}</h3>

        <div className="flex flex-col gap-6">
          <Select
            label={dict.serviceType}
            required
            placeholder={dict.select}
            options={serviceTypeOptions}
            value={serviceType}
            onChange={setServiceType}
          />

          <Select
            label={dict.userCity}
            required
            placeholder={dict.selectCity}
            options={cityOptions}
            value={city}
            onChange={setCity}
          />

          {/* Preferred Time to Call — day cards */}
          <div>
            <FieldLabel label={dict.preferredTime} required />
            <div className="grid grid-cols-2 gap-6">
              {timeCards.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setPreferredTime(t.value)}
                  className={`px-4 py-3 text-center border rounded transition-colors ${
                    preferredTime === t.value
                      ? "bg-[#002C5F] border-[#002C5F] text-white"
                      : "bg-white border-gray-200 text-gray-900"
                  }`}
                >
                  <span className="block font-bold text-sm">{t.day}</span>
                  <span className={`block text-xs mt-1 ${preferredTime === t.value ? "text-white/80" : "text-gray-500"}`}>
                    {t.hours}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Vehicle Information ---------------- */}
      <section className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-5">{dict.vehicleInfo}</h3>

        <div className="flex flex-col gap-6">
          <Select
            label={dict.vehicle}
            required
            placeholder={dict.selectModel}
            options={modelOptions}
            value={carModel}
            onChange={setCarModel}
          />

          <Select
            label={dict.manufacturingYear}
            required
            placeholder={dict.selectYear}
            options={yearOptions}
            value={year}
            onChange={setYear}
          />

          <TextInput label={dict.vin} value={vin} onChange={setVin} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput label={dict.plateNumbers} value={plateNumber} onChange={setPlateNumber} inputMode="numeric" />
            <TextInput label={dict.plateLetter} value={plateLetter} onChange={setPlateLetter} />
          </div>

          <TextInput label={dict.mileage} value={mileage} onChange={setMileage} inputMode="numeric" />
        </div>
      </section>

      {/* ---------------- Your Information ---------------- */}
      <section className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-5">{dict.yourInfo}</h3>

        <div className="flex flex-col gap-6">
          <Select
            label={dict.gender}
            placeholder={dict.select}
            options={genderOptions}
            value={gender}
            onChange={setGender}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput label={dict.firstName} required value={firstName} onChange={setFirstName} />
            <TextInput label={dict.lastName} required value={lastName} onChange={setLastName} />
          </div>

          <TextInput label={dict.email} required type="email" inputMode="email" value={email} onChange={setEmail} />

          {/* phone with fixed +964 — same attached-prefix style as the contact form */}
          <div>
            <FieldLabel label={dict.phone} required />
            <div className="flex">
              <span
                className={`px-3 py-3 border border-gray-200 bg-gray-50 text-sm text-gray-600 flex items-center ${
                  isAr ? "rounded-e border-s-0" : "rounded-s border-e-0"
                }`}
              >
                +964
              </span>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                dir="ltr"
                className={`w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#00AAD2] transition-colors ${
                  isAr ? "rounded-s text-end" : "rounded-e"
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Privacy + consent ---------------- */}
      <section className="mt-8 pt-6 border-t border-gray-200">
        <div className="mb-4">
          <p className={`text-xs text-gray-500 ${privacyOpen ? "" : "line-clamp-2"}`}>
            {dict.privacyText}
          </p>
          <button
            type="button"
            onClick={() => setPrivacyOpen((o) => !o)}
            className="mt-1 text-xs text-gray-500 underline"
          >
            {privacyOpen ? dict.readLess : dict.readMore}
          </button>
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreeCommercial}
            onChange={(e) => setAgreeCommercial(e.target.checked)}
            className="mt-0.5 accent-[#002C5F]"
          />
          <span>{dict.agreeCommercial}</span>
        </label>

        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={agreePrivacy}
            onChange={(e) => setAgreePrivacy(e.target.checked)}
            className="mt-0.5 accent-[#002C5F]"
          />
          <span>
            {dict.agreePrivacy}{" "}
            <a href={`/${locale}/privacy-policy`} className="text-[#002C5F] font-medium hover:underline">
              {dict.privacyPolicy}
            </a>
          </span>
        </label>

        {state === "invalid" && <p className="mt-4 text-sm text-red-500">{dict.requiredMsg}</p>}
        {state === "error" && <p className="mt-4 text-sm text-red-500">{dict.errorMsg}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={state === "submitting"}
          className="mt-8 px-8 py-3 bg-[#002C5F] text-white text-sm font-semibold rounded hover:bg-[#003d7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "submitting" ? dict.submitting : dict.submit}
        </button>
      </section>
    </div>
  );
}