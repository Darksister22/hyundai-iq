// lib/iraqi-governorates.ts
// The 18 Iraqi governorates. `en` is also the value stored in the DB
// so dashboard data stays language-independent.

export interface Governorate {
  en: string;
  ar: string;
}

export const IRAQI_GOVERNORATES: Governorate[] = [
  { en: "Baghdad",       ar: "بغداد" },
  { en: "Basra",         ar: "البصرة" },
  { en: "Nineveh",       ar: "نينوى" },
  { en: "Erbil",         ar: "أربيل" },
  { en: "Sulaymaniyah",  ar: "السليمانية" },
  { en: "Duhok",         ar: "دهوك" },
  { en: "Kirkuk",        ar: "كركوك" },
  { en: "Anbar",         ar: "الأنبار" },
  { en: "Babil",         ar: "بابل" },
  { en: "Karbala",       ar: "كربلاء" },
  { en: "Najaf",         ar: "النجف" },
  { en: "Wasit",         ar: "واسط" },
  { en: "Maysan",        ar: "ميسان" },
  { en: "Dhi Qar",       ar: "ذي قار" },
  { en: "Muthanna",      ar: "المثنى" },
  { en: "Qadisiyah",     ar: "القادسية" },
  { en: "Diyala",        ar: "ديالى" },
  { en: "Salah al-Din",  ar: "صلاح الدين" },
];