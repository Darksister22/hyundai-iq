export interface VehicleSpec {
  engine: string;
  power: string;
  torque: string;
  drive: string;
}

export interface VehicleHighlight {
  category: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  image: string;
}

export interface ColorOption {
  nameEn: string;
  nameAr: string;
  hex: string;
  image: string;
}

export interface GalleryItem {
  image: string;
  captionEn?: string;
  captionAr?: string;
}

export interface FeatureItem {
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  image: string;
}

export interface SpecRow {
  labelEn: string;
  labelAr: string;
  value: string;
}

export interface SpecGroup {
  groupEn: string;
  groupAr: string;
  rows: SpecRow[];
}

export interface VehicleModel {
  slug: string;
  nameEn: string;
  nameAr: string;
  category: "sedan" | "suv" | "electric" | "mpv";
  taglineEn: string;
  taglineAr: string;
  hero: string;
  specs: VehicleSpec;
  highlights: VehicleHighlight[];
  exterior: {
    gallery: GalleryItem[];
    colors: ColorOption[];
  };
  interior: {
    gallery: GalleryItem[];
    panorama360?: string; // equirectangular image for the 360 viewer
  };
  performance: FeatureItem[];
  safety: FeatureItem[];
  convenience: FeatureItem[];
  specification: SpecGroup[];
}

// placeholder data — will be replaced by dashboard API
export const models: VehicleModel[] = [
  {
    slug: "accent",
    nameEn: "ACCENT",
    nameAr: "أكسنت",
    category: "sedan",
    taglineEn: "Smart elegance and space beyond expectations",
    taglineAr: "أناقة ذكية ومساحة تفوق التوقعات",
    hero: "/images/models/accent-hero.webp",
    specs: {
      engine: "1.5L",
      power: "113 HP",
      torque: "144 Nm",
      drive: "2WD",
    },
    highlights: [
      {
        category: "design",
        titleEn: "City spirit and next-gen confidence",
        titleAr: "تصميم يعكس روح المدينة وثقة الجيل الجديد",
        descEn:
          "Placeholder copy describing the exterior design language and overall character of the vehicle.",
        descAr: "نص مؤقت يصف لغة التصميم الخارجي والطابع العام للسيارة.",
        image: "/images/models/accent-design.webp",
      },
      {
        category: "performance",
        titleEn: "Quiet power and smooth daily performance",
        titleAr: "قوة هادئة وأداء يومي سلس",
        descEn:
          "Placeholder copy describing engine response, refinement, and driving feel.",
        descAr: "نص مؤقت يصف استجابة المحرك والنعومة وإحساس القيادة.",
        image: "/images/models/accent-performance.webp",
      },
      {
        category: "safety",
        titleEn: "Stronger frame and smarter protection",
        titleAr: "هيكل أقوى وحماية أذكى",
        descEn:
          "Placeholder copy describing the safety systems and body structure.",
        descAr: "نص مؤقت يصف أنظمة السلامة وهيكل السيارة.",
        image: "/images/models/accent-safety.webp",
      },
      {
        category: "convenience",
        titleEn: "Advanced comfort with smart features",
        titleAr: "راحة متقدمة بميزات ذكية",
        descEn:
          "Placeholder copy describing the convenience and comfort features.",
        descAr: "نص مؤقت يصف ميزات الراحة والرفاهية.",
        image: "/images/models/accent-convenience.webp",
      },
    ],
    exterior: {
      gallery: [
        { image: "/images/models/accent-ext-1.webp" },
        { image: "/images/models/accent-ext-2.webp" },
        { image: "/images/models/accent-ext-3.webp" },
      ],
      colors: [
        {
          nameEn: "Polar White",
          nameAr: "أبيض قطبي",
          hex: "#F4F4F2",
          image: "/images/models/accent-color-white.webp",
        },
        {
          nameEn: "Phantom Black",
          nameAr: "أسود فانتوم",
          hex: "#1A1A1A",
          image: "/images/models/accent-color-black.webp",
        },
        {
          nameEn: "Dazzling Blue",
          nameAr: "أزرق لامع",
          hex: "#2B4A7E",
          image: "/images/models/accent-color-blue.webp",
        },
        {
          nameEn: "Fiery Red",
          nameAr: "أحمر ناري",
          hex: "#A21F2D",
          image: "/images/models/accent-color-red.webp",
        },
      ],
    },
    interior: {
      gallery: [
        { image: "/images/models/accent-int-1.webp" },
        { image: "/images/models/accent-int-2.webp" },
        { image: "/images/models/accent-int-3.webp" },
      ],
      panorama360: "/images/models/accent-360-interior.webp",
    },
    performance: [
      {
        titleEn: "Smart Stream engine",
        titleAr: "محرك Smart Stream",
        descEn: "Placeholder copy describing the engine technology.",
        descAr: "نص مؤقت يصف تقنية المحرك.",
        image: "/images/models/accent-perf-1.webp",
      },
      {
        titleEn: "IVT transmission",
        titleAr: "ناقل حركة IVT",
        descEn: "Placeholder copy describing the transmission.",
        descAr: "نص مؤقت يصف ناقل الحركة.",
        image: "/images/models/accent-perf-2.webp",
      },
    ],
    safety: [
      {
        titleEn: "Multiple airbags",
        titleAr: "وسائد هوائية متعددة",
        descEn: "Placeholder copy describing the airbag system.",
        descAr: "نص مؤقت يصف نظام الوسائد الهوائية.",
        image: "/images/models/accent-safety-1.webp",
      },
      {
        titleEn: "Anti-lock braking (ABS)",
        titleAr: "نظام منع انغلاق المكابح (ABS)",
        descEn: "Placeholder copy describing the braking system.",
        descAr: "نص مؤقت يصف نظام المكابح.",
        image: "/images/models/accent-safety-2.webp",
      },
    ],
    convenience: [
      {
        titleEn: "8-inch display audio",
        titleAr: "شاشة صوتية مقاس 8 إنش",
        descEn: "Placeholder copy describing the infotainment system.",
        descAr: "نص مؤقت يصف نظام المعلومات والترفيه.",
        image: "/images/models/accent-conv-1.webp",
      },
      {
        titleEn: "Wireless charging",
        titleAr: "شحن لاسلكي",
        descEn: "Placeholder copy describing the charging feature.",
        descAr: "نص مؤقت يصف ميزة الشحن.",
        image: "/images/models/accent-conv-2.webp",
      },
    ],
    specification: [
      {
        groupEn: "Engine",
        groupAr: "المحرك",
        rows: [
          { labelEn: "Type", labelAr: "النوع", value: "1.5L Smart Stream" },
          { labelEn: "Max power", labelAr: "القوة القصوى", value: "113 HP" },
          { labelEn: "Max torque", labelAr: "عزم الدوران", value: "144 Nm" },
        ],
      },
      {
        groupEn: "Dimensions",
        groupAr: "الأبعاد",
        rows: [
          { labelEn: "Length", labelAr: "الطول", value: "4,500 mm" },
          { labelEn: "Width", labelAr: "العرض", value: "1,729 mm" },
          { labelEn: "Height", labelAr: "الارتفاع", value: "1,470 mm" },
          { labelEn: "Wheelbase", labelAr: "قاعدة العجلات", value: "2,580 mm" },
        ],
      },
      {
        groupEn: "Wheels",
        groupAr: "العجلات",
        rows: [
          { labelEn: "Tire size", labelAr: "مقاس الإطار", value: "195/65 R15" },
          { labelEn: "Wheel type", labelAr: "نوع الجنط", value: "Alloy" },
        ],
      },
    ],
  },
  // Other models: minimal data, sections render as placeholders until filled
  {
    slug: "elantra",
    nameEn: "ELANTRA",
    nameAr: "إلنترا",
    category: "sedan",
    taglineEn: "Dynamic styling with cutting-edge technology",
    taglineAr: "تصميم ديناميكي مع تقنيات متطورة",
    hero: "/images/models/elantra-hero.webp",
    specs: { engine: "1.6L", power: "123 HP", torque: "154 Nm", drive: "2WD" },
    highlights: [],
    exterior: { gallery: [], colors: [] },
    interior: { gallery: [] },
    performance: [],
    safety: [],
    convenience: [],
    specification: [],
  },
  {
    slug: "sonata",
    nameEn: "SONATA",
    nameAr: "سوناتا",
    category: "sedan",
    taglineEn: "Absolute sensation",
    taglineAr: "إحساس مطلق",
    hero: "/images/models/sonata-hero.webp",
    specs: { engine: "2.5L", power: "191 HP", torque: "245 Nm", drive: "2WD" },
    highlights: [],
    exterior: { gallery: [], colors: [] },
    interior: { gallery: [] },
    performance: [],
    safety: [],
    convenience: [],
    specification: [],
  },
  {
    slug: "tucson",
    nameEn: "TUCSON",
    nameAr: "توسان",
    category: "suv",
    taglineEn: "Sensuous sportiness",
    taglineAr: "رياضية حسية",
    hero: "/images/models/tucson-hero.webp",
    specs: {
      engine: "1.6L Turbo",
      power: "178 HP",
      torque: "265 Nm",
      drive: "2WD / 4WD",
    },
    highlights: [],
    exterior: { gallery: [], colors: [] },
    interior: { gallery: [] },
    performance: [],
    safety: [],
    convenience: [],
    specification: [],
  },
  {
    slug: "creta",
    nameEn: "CRETA",
    nameAr: "كريتا",
    category: "suv",
    taglineEn: "Smart and bold SUV",
    taglineAr: "SUV ذكي وجريء",
    hero: "/images/models/creta-hero.webp",
    specs: { engine: "1.5L", power: "115 HP", torque: "144 Nm", drive: "2WD" },
    highlights: [],
    exterior: { gallery: [], colors: [] },
    interior: { gallery: [] },
    performance: [],
    safety: [],
    convenience: [],
    specification: [],
  },
  {
    slug: "santa-fe",
    nameEn: "SANTA FE",
    nameAr: "سانتا في",
    category: "suv",
    taglineEn: "The ultimate family SUV",
    taglineAr: "سيارة العائلة المثالية",
    hero: "/images/models/santa-fe-hero.webp",
    specs: {
      engine: "2.5L Turbo",
      power: "281 HP",
      torque: "421 Nm",
      drive: "4WD",
    },
    highlights: [],
    exterior: { gallery: [], colors: [] },
    interior: { gallery: [] },
    performance: [],
    safety: [],
    convenience: [],
    specification: [],
  },
  {
    slug: "staria",
    nameEn: "STARIA",
    nameAr: "ستاريا",
    category: "mpv",
    taglineEn: "Futuristic design meets spacious versatility",
    taglineAr: "تصميم مستقبلي يلتقي مع تعدد الاستخدامات",
    hero: "/images/models/staria-hero.webp",
    specs: {
      engine: "3.5L V6",
      power: "272 HP",
      torque: "331 Nm",
      drive: "2WD",
    },
    highlights: [],
    exterior: { gallery: [], colors: [] },
    interior: { gallery: [] },
    performance: [],
    safety: [],
    convenience: [],
    specification: [],
  },
];

// these functions will be replaced by API calls to your dashboard
export function getModelBySlug(slug: string): VehicleModel | null {
  return models.find((m) => m.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return models.map((m) => m.slug);
}

export function getModelsByCategory(
  category?: VehicleModel["category"]
): VehicleModel[] {
  if (!category) return models;
  return models.filter((m) => m.category === category);
}
