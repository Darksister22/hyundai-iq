export interface Bilingual {
  ar: string;
  en: string;
}

export interface OfferCar {
  modelSlug: string;        // links to /models/[modelSlug]
  name: Bilingual;
  image: string;
  details: Bilingual[];     // white list
  ctaValue: Bilingual;      // navy box headline
}

export interface Offer {
  slug: string;
  title: Bilingual;
  subtitle: Bilingual;
  image: string;
  cars: OfferCar[];         // empty → no carousel, use `details`/`ctaValue`
  details: Bilingual[];
  ctaValue: Bilingual;
}

export const VEHICLE_OFFERS: Offer[] = [
  {
    slug: "next-starts-now",
    title: { en: "Next Starts Now", ar: "المستقبل يبدأ الآن" },
    subtitle: {
      en: "Summer Starts with Hyundai. Unleash your energy.",
      ar: "الصيف يبدأ مع هيونداي. أطلق طاقتك.",
    },
    image: "/images/IONIQ_9_3.webp",
    details: [],
    ctaValue: { en: "", ar: "" },
    cars: [
      {
        modelSlug: "ioniq-9",
        name: { en: "IONIQ 9", ar: "أيونيك 9" },
        image: "/images/IONIQ_9_3.webp",
        details: [
          { en: "0% Down Payment", ar: "بدون دفعة أولى" },
          { en: "5 Years / 100,000 km Manufacturer Warranty", ar: "ضمان المصنع 5 سنوات / 100,000 كم" },
          { en: "5 Years Roadside Assistance", ar: "مساعدة على الطريق لمدة 5 سنوات" },
        ],
        ctaValue: { en: "IQD 599,000 Monthly", ar: "599,000 د.ع شهرياً" },
      },
      {
        modelSlug: "tucson",
        name: { en: "Tucson", ar: "توسان" },
        image: "/images/row1.webp",
        details: [
          { en: "0% Down Payment", ar: "بدون دفعة أولى" },
          { en: "5 Years / 100,000 km Manufacturer Warranty", ar: "ضمان المصنع 5 سنوات / 100,000 كم" },
          { en: "Free first 3 services", ar: "أول 3 صيانات مجاناً" },
        ],
        ctaValue: { en: "IQD 449,000 Monthly", ar: "449,000 د.ع شهرياً" },
      },
    ],
  },
];

export const AFTERSALES_OFFERS: Offer[] = [
  {
    slug: "summer-service-offer",
    title: { en: "Summer Service Offer", ar: "عرض صيانة الصيف" },
    subtitle: {
      en: "Get your Hyundai summer-ready with our seasonal service package.",
      ar: "جهّز سيارتك هيونداي للصيف مع باقة الصيانة الموسمية.",
    },
    image: "/images/services/aftersales-banner.webp",
    cars: [],
    details: [
      { en: "Complimentary 30-point inspection", ar: "فحص شامل من 30 نقطة مجاناً" },
      { en: "20% off air conditioning service", ar: "خصم 20% على صيانة التكييف" },
      { en: "Free battery and coolant check", ar: "فحص مجاني للبطارية وسائل التبريد" },
    ],
    ctaValue: { en: "Save up to 25%", ar: "وفّر حتى 25%" },
  },
];

export const findOffer = (list: Offer[], slug: string) =>
  list.find((o) => o.slug === slug) ?? null;