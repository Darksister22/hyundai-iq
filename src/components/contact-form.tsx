"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

// Typed inline from the dictionary, same convention as Footer.
// Mirrors the official Hyundai ME contact form fields.
interface ContactDict {
  heading?: string;
  yourInfo: string;
  gender: string;
  male: string;
  female: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  inquiryType: string;
  choose: string;
  inquiryGeneral: string;
  inquirySales: string;
  inquiryService: string;
  inquiryComplaint: string;
  comments: string;
  charsSuffix: string;
  attachments: string;
  addFile: string;
  fileHint: string;
  marketingTitle: string;
  marketingIntro: string;
  consentRequired: string;
  optOut: string;
  privacyConsent: string;
  send: string;
  successMsg: string;
}

interface ContactFormProps {
  locale: Locale;
  dict: ContactDict;
}

const MAX_CHARS = 5000; // official 5000-character limit
const MAX_FILES = 2; // official: up to 2 files
const ACCEPTED = ".pdf,.jpeg,.jpg,.png"; // official: PDF, JPEG, PNG only

// shared input styling, matches the rest of the site
const inputCls =
  "w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#00AAD2] transition-colors";

export default function ContactForm({ locale, dict }: ContactFormProps) {
  const isAr = locale === "ar";

  const [comments, setComments] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false); // required privacy consent
  const [submitted, setSubmitted] = useState(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_FILES));
    e.target.value = ""; // allow re-selecting the same filename later
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  // frontend-only: no API, just show the success state
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return; // guard: consent is mandatory
    setSubmitted(true);
  };

  // inquiry dropdown options, built from the dictionary
  const inquiryOptions = [
    dict.inquiryGeneral,
    dict.inquirySales,
    dict.inquiryService,
    dict.inquiryComplaint,
  ];

  if (submitted) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        {/* success checkmark */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#00AAD2]/10 text-[#00AAD2] text-2xl">
          ✓
        </div>
        <p className="text-[#002C5F] font-semibold">{dict.successMsg}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 p-8"
    >
      <h2 className="text-sm font-semibold text-gray-700 mb-5">
        {dict.yourInfo}
      </h2>
      <div className="mb-6">
        <span className="block text-sm text-gray-600 mb-2">{dict.gender}</span>
        <div className="flex gap-6">
          {[dict.male, dict.female].map((g) => (
            <label
              key={g}
              className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
            >
              <input
                type="radio"
                name="gender"
                value={g}
                className="accent-[#002C5F]"
              />
              {g}
            </label>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label={dict.firstName} required>
          <input type="text" required className={inputCls} />
        </Field>
        <Field label={dict.lastName} required>
          <input type="text" required className={inputCls} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Field label={dict.email} required>
          <input type="email" required className={inputCls} />
        </Field>
        <Field label={dict.phone} required>
          {/* +964 = Iraq country code, prefixed before the number */}
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
              required
              dir="ltr"
              className={`w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#00AAD2] transition-colors ${
                isAr ? "rounded-s text-end" : "rounded-e"
              }`}
            />
          </div>
        </Field>
      </div>

      <div className="mt-6">
        <Field label={dict.inquiryType} required>
          <select required defaultValue="" className={inputCls}>
            <option value="" disabled>
              {dict.choose}
            </option>
            {inquiryOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-6">
        <label className="block text-sm text-gray-600 mb-2">
          {dict.comments}
        </label>
        <textarea
          rows={5}
          maxLength={MAX_CHARS}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className={`${inputCls} resize-none`}
        />
        <p className="text-xs text-gray-400 mt-1 text-end">
          {comments.length} / {MAX_CHARS} {dict.charsSuffix}
        </p>
      </div>

      <div className="mt-6">
        <span className="block text-sm text-gray-600 mb-2">
          {dict.attachments}
        </span>
        <label className="inline-block px-5 py-2 border border-[#002C5F] text-[#002C5F] text-sm font-semibold rounded cursor-pointer hover:bg-[#002C5F] hover:text-white transition-colors">
          {dict.addFile}
          <input
            type="file"
            accept={ACCEPTED}
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-400 mt-2">{dict.fileHint}</p>

        {/* selected file chips */}
        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((file, i) => (
              <li
                key={i}
                className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 rounded px-3 py-2"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-gray-400 hover:text-red-500 ms-3 shrink-0"
                  aria-label="remove file"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Marketing / consent */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          {dict.marketingTitle}
        </h3>
        <p className="text-xs text-gray-500 mb-4">{dict.marketingIntro}</p>

        <label className="flex items-start gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 accent-[#002C5F]"
          />
          <span>
            {dict.consentRequired}
            <span className="text-red-500 ms-0.5">*</span>
          </span>
        </label>

        {/* optional opt-out */}
        <label className="flex items-start gap-2 text-sm text-gray-700 mb-3 cursor-pointer">
          <input type="checkbox" className="mt-0.5 accent-[#002C5F]" />
          <span>{dict.optOut}</span>
        </label>

        {/* privacy policy acknowledgement */}
        <label className="flex items-start gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" className="mt-0.5 accent-[#002C5F]" />
          <span>{dict.privacyConsent}</span>
        </label>
      </div>

      {/* Submit — disabled until required consent is checked */}
      <button
        type="submit"
        disabled={!consent}
        className="mt-8 px-8 py-3 bg-[#002C5F] text-white text-sm font-semibold rounded hover:bg-[#003d7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {dict.send}
      </button>
    </form>
  );
}

// label + required-asterisk wrapper
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-2">
        {label}
        {required && <span className="text-red-500 ms-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
