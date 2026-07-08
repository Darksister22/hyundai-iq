// ── Shared sub-types ──

export interface OverviewStat {
  labelEn: string;
  labelAr: string;
  value: string;
}

export interface FeatureCard {
  category?: string;
  titleEn: string;
  titleAr: string;
  descEn: string;
  descAr: string;
  image: string;
}
//Test
export interface CaptionedImage {
  image: string;
  captionEn: string;
  captionAr: string;
}

export interface ColorOption {
  nameEn: string;
  nameAr: string;
  hex: string;
  gradient: string; // background gradient shown behind this color's spin
  spinFrames: string[];
}
export interface InteriorOption {
  nameEn: string;
  nameAr: string;
  hex: string;           // swatch color
  panorama: string;      // 360 image for this trim
}
/**
 * Generates an ordered list of spin-frame paths.
 * Matches the "prefix- (1).webp, prefix- (2).webp, ..." naming.
 *   spinFrames("/images/models/accent/spin/grey-", 36)
 *   → [".../grey- (1).webp", ".../grey- (2).webp", ... 36 entries]
 */
export function spinFrames(
  prefix: string,
  count: number,
  ext = "webp"
): string[] {
  return Array.from(
    { length: count },
    (_, i) => `${prefix} (${i + 1}).${ext}`
  );
}

export interface DesignRow {
  labelEn: string;
  labelAr: string;
  titleEn: string;
  titleAr: string;
  image: string;
}

export interface PerfStat {
  labelEn: string;
  labelAr: string;
  value: string;
}

export interface VehicleModel {
  slug: string;
  nameEn: string;
  nameAr: string;
  category: "sedan" | "suv" | "electric" | "mpv";
  hero: string;
  heroHeadlineEn: string;
  heroHeadlineAr: string;
  overview: {
    headlineEn: string;
    headlineAr: string;
    taglineEn: string;
    taglineAr: string;
    engineEn: string;
    engineAr: string;
    stats: OverviewStat[];
  };
  highlights: FeatureCard[];
  design: {
    headingEn: string;
    headingAr: string;
    heroImage: string;
    exterior: CaptionedImage[];
    interior: CaptionedImage[];
  };
  additionalDesign: {
    headingEn: string;
    headingAr: string;
    rows: DesignRow[];
  };
  visualizer: {
    colors: ColorOption[];
    interiorColors?: InteriorOption[];   // ← full option (nameEn/nameAr/hex/panorama)
  };
  performance: {
    heroImage: string;
    engineEn: string;
    engineAr: string;
    stats: PerfStat[];
    closingImage: string;
  };
  safety: {
    headingEn: string;
    headingAr: string;
    cards: FeatureCard[];
  };
  convenience: {
    headingEn: string;
    headingAr: string;
    bgImage: string;
    cards: FeatureCard[];
  };
  gallery: string[];
}

const emptySections = {
  highlights: [],
  design: { headingEn: "", headingAr: "", heroImage: "", exterior: [], interior: [] },
  additionalDesign: { headingEn: "", headingAr: "", rows: [] },
  visualizer: { colors: [] },
  performance: { heroImage: "", engineEn: "", engineAr: "", stats: [], closingImage: "" },
  safety: { headingEn: "", headingAr: "", cards: [] },
  convenience: { headingEn: "", headingAr: "", bgImage: "", cards: [] },
  gallery: [],
};

export const models: VehicleModel[] = [
  {
    slug: "accent",
    nameEn: "ACCENT",
    nameAr: "أكسنت",
    category: "sedan",
    hero: "/images/models/accent/hero.webp",
    heroHeadlineEn: "Bold and sophisticated",
    heroHeadlineAr: "جريئة وأنيقة",
    overview: {
      headlineEn: "This is How You Dare",
      headlineAr: "هكذا تجرؤ",
      taglineEn: "Refined sportiness, exquisite interior, and advanced safety and convenience features",
      taglineAr: "رياضية مصقولة، تصميم داخلي رائع، وميزات سلامة وراحة متطورة",
      engineEn: "1.5L Gasoline",
      engineAr: "١.٥ لتر بنزين",
      stats: [
        { labelEn: "Max Power", labelAr: "القوة القصوى", value: "113 HP" },
        { labelEn: "Max Torque", labelAr: "عزم الدوران", value: "144 Nm" },
        { labelEn: "Seating", labelAr: "المقاعد", value: "5 Seats" },
        { labelEn: "Drive", labelAr: "الدفع", value: "2 WD (FWD)" },
      ],
    },
    highlights: [
      { category: "Safety", titleEn: "Exceptional Safety", titleAr: "سلامة استثنائية", descEn: "Placeholder description for the safety highlight card.", descAr: "وصف مؤقت لبطاقة ميزة السلامة.", image: "/images/models/accent/highlight-safety.webp" },
      { category: "Convenience", titleEn: "A New Level of Excellence", titleAr: "مستوى جديد من التميز", descEn: "Placeholder description for the convenience highlight card.", descAr: "وصف مؤقت لبطاقة ميزة الراحة.", image: "/images/models/accent/highlight-convenience.webp" },
      { category: "Design", titleEn: "Parametric Dynamics", titleAr: "الديناميكية البارامترية", descEn: "Placeholder description for the design highlight card.", descAr: "وصف مؤقت لبطاقة ميزة التصميم.", image: "/images/models/accent/highlight-design.webp" },
    ],
    design: {
      headingEn: "Refined Sportiness",
      headingAr: "رياضية مصقولة",
      heroImage: "/images/models/accent/design-hero.webp",
      exterior: [
        { image: "/images/models/accent/ext-1.webp", captionEn: "LED tail lamps create a bold, continuous light signature with a confident rear stance.", captionAr: "مصابيح خلفية LED تخلق توقيعًا ضوئيًا جريئًا ومستمرًا بمظهر خلفي واثق." },
        { image: "/images/models/accent/ext-2.webp", captionEn: "Full LED headlamps blend with the parametric grille for a striking front stance.", captionAr: "مصابيح أمامية LED كاملة تمتزج مع الشبك البارامتري لمظهر أمامي لافت." },
        { image: "/images/models/accent/ext-3.webp", captionEn: "Placeholder caption for an additional exterior shot.", captionAr: "تعليق مؤقت للقطة خارجية إضافية." },
      ],
      interior: [
        { image: "/images/models/accent/int-1.webp", captionEn: "Dual displays integrated under a single glass panel for a clear, high-tech feel.", captionAr: "شاشات مزدوجة مدمجة تحت لوحة زجاجية واحدة لإحساس واضح وعالي التقنية." },
        { image: "/images/models/accent/int-2.webp", captionEn: "Crafted for comfort with power adjustment and lumbar support on every journey.", captionAr: "مصممة للراحة مع تعديل كهربائي ودعم قطني في كل رحلة." },
      ],
    },
    additionalDesign: {
      headingEn: "A Deeper Look into the Design Craftsmanship",
      headingAr: "نظرة أعمق على إتقان التصميم",
      rows: [
        { labelEn: "Power Driver's Seat", labelAr: "مقعد سائق كهربائي", titleEn: "Easily adjust seat height and position to find your perfect driving posture.", titleAr: "اضبط بسهولة ارتفاع المقعد وموضعه للعثور على وضعية القيادة المثالية.", image: "/images/models/accent/add-1.webp" },
        { labelEn: "USB-C Type Charger", labelAr: "شاحن USB-C", titleEn: "Enjoy faster charging and seamless connectivity with the switch-type USB-C module.", titleAr: "استمتع بشحن أسرع واتصال سلس مع وحدة USB-C.", image: "/images/models/accent/add-2.webp" },
        { labelEn: "Ventilated Seats", labelAr: "مقاعد مهواة", titleEn: "Helps you stay cool and comfortable by keeping your temperature regulated.", titleAr: "تساعدك على البقاء منتعشًا ومرتاحًا من خلال تنظيم درجة حرارتك.", image: "/images/models/accent/add-3.webp" },
      ],
    },
    visualizer: {
      colors: [
        { nameEn: "Fluid Grey Metal", nameAr: "رمادي معدني", hex: "#9A9C9E", gradient: "linear-gradient(180deg, #8C8E90 0%, #A7A9AB 100%)", spinFrames: spinFrames("/images/models/accent/spin/grey-", 36) },
        { nameEn: "Polar White", nameAr: "أبيض قطبي", hex: "#EDEDED", gradient: "linear-gradient(180deg, #D8D8D8 0%, #F0F0F0 100%)", spinFrames: spinFrames("/images/models/accent/spin/white-", 36) },
        { nameEn: "Phantom Black", nameAr: "أسود فانتوم", hex: "#1C1C1C", gradient: "linear-gradient(180deg, #2A2A2A 0%, #4A4A4A 100%)", spinFrames: spinFrames("/images/models/accent/spin/black-", 36) },
        { nameEn: "Intense Blue", nameAr: "أزرق كثيف", hex: "#1F4E8C", gradient: "linear-gradient(180deg, #1E3F6E 0%, #3E6BA8 100%)", spinFrames: spinFrames("/images/models/accent/spin/blue-", 36) },
      ],
      interiorColors: [
        { nameEn: "White", nameAr: "ابيض", hex: "#EDEDED", panorama: "/images/models/accent/interior-360.webp" },
        { nameEn: "White", nameAr: "اسود", hex: "#AAAA", panorama: "/images/models/accent/interior-360.webp" }

      ]
    },
    performance: {
      heroImage: "/images/models/accent/perf-hero.webp",
      engineEn: "1.5L Gasoline",
      engineAr: "١.٥ لتر بنزين",
      stats: [
        { labelEn: "Max Power", labelAr: "القوة القصوى", value: "113 HP" },
        { labelEn: "Max Torque", labelAr: "عزم الدوران", value: "144 Nm" },
        { labelEn: "Transmission", labelAr: "ناقل الحركة", value: "IVT" },
        { labelEn: "0-100 kph", labelAr: "٠-١٠٠ كم/س", value: "10.4 seconds" },
      ],
      closingImage: "/images/models/accent/perf-closing.webp",
    },
    safety: {
      headingEn: "Revel in the Safety of Premium Models",
      headingAr: "انعم بسلامة الطرازات الفاخرة",
      cards: [
        { titleEn: "ECM (Electrochromic Rearview Mirror)", titleAr: "مرآة رؤية خلفية إلكتروكرومية", descEn: "Placeholder description for the ECM safety feature.", descAr: "وصف مؤقت لميزة السلامة ECM.", image: "/images/models/accent/safety-1.webp" },
        { titleEn: "Forward Collision-Avoidance Assist (FCA)", titleAr: "مساعد تجنب الاصطدام الأمامي", descEn: "Placeholder description for the FCA safety feature.", descAr: "وصف مؤقت لميزة السلامة FCA.", image: "/images/models/accent/safety-2.webp" },
        { titleEn: "Blind Spot Collision-Avoidance Assist (BCA)", titleAr: "مساعد تجنب تصادم النقطة العمياء", descEn: "Placeholder description for the BCA safety feature.", descAr: "وصف مؤقت لميزة السلامة BCA.", image: "/images/models/accent/safety-3.webp" },
        { titleEn: "Rear Cross-Traffic Collision Assist (RCCA)", titleAr: "مساعد تصادم حركة المرور الخلفية", descEn: "Placeholder description for the RCCA safety feature.", descAr: "وصف مؤقت لميزة السلامة RCCA.", image: "/images/models/accent/safety-4.webp" },
      ],
    },
    convenience: {
      headingEn: "Enhanced Drives",
      headingAr: "قيادة محسّنة",
      bgImage: "/images/models/accent/conv-bg.webp",
      cards: [
        { titleEn: "Apple CarPlay and Android Auto", titleAr: "Apple CarPlay و Android Auto", descEn: "Placeholder description for smartphone connectivity.", descAr: "وصف مؤقت لاتصال الهاتف الذكي.", image: "/images/models/accent/conv-1.webp" },
        { titleEn: "Wireless Smartphone Charger", titleAr: "شاحن لاسلكي للهاتف", descEn: "Placeholder description for the wireless charger.", descAr: "وصف مؤقت للشاحن اللاسلكي.", image: "/images/models/accent/conv-2.webp" },
        { titleEn: "Integrated Voice Control", titleAr: "تحكم صوتي مدمج", descEn: "Placeholder description for voice control.", descAr: "وصف مؤقت للتحكم الصوتي.", image: "/images/models/accent/conv-3.webp" },
      ],
    },
    gallery: [
      "/images/models/accent/gallery-1.webp",
      "/images/models/accent/gallery-2.webp",
      "/images/models/accent/gallery-3.webp",
      "/images/models/accent/gallery-4.webp",
      "/images/models/accent/gallery-5.webp",
      "/images/models/accent/gallery-6.webp",
    ],
  },
  {
    slug: "elantra",
    nameEn: "ELANTRA",
    nameAr: "إلنترا",
    category: "sedan",
    hero: "/images/models/elantra/hero.webp",
    heroHeadlineEn: "Bold and sophisticated",
    heroHeadlineAr: "جريئة وأنيقة",
    overview: {
      headlineEn: "This is How You Dare",
      headlineAr: "هكذا تجرؤ",
      taglineEn: "Refined sportiness, exquisite interior, and advanced safety and convenience features",
      taglineAr: "رياضية مصقولة، تصميم داخلي رائع، وميزات سلامة وراحة متطورة",
      engineEn: "2.0L Gasoline",
      engineAr: "٢.٠ لتر بنزين",
      stats: [
        { labelEn: "Max Power", labelAr: "القوة القصوى", value: "157 HP" },
        { labelEn: "Max Torque", labelAr: "عزم الدوران", value: "191 Nm" },
        { labelEn: "Seating", labelAr: "المقاعد", value: "5 Seats" },
        { labelEn: "Drive", labelAr: "الدفع", value: "2 WD (FWD)" },
      ],
    },
    ...emptySections,
  },
  {
    slug: "tucson",
    nameEn: "TUCSON",
    nameAr: "توسان",
    category: "suv",
    hero: "/images/models/tucson/hero.webp",
    heroHeadlineEn: "Sensuous sportiness",
    heroHeadlineAr: "رياضية حسية",
    overview: {
      headlineEn: "Designed to Stand Out",
      headlineAr: "صُممت لتتميز",
      taglineEn: "Bold design, spacious interior, and advanced technology",
      taglineAr: "تصميم جريء، مقصورة واسعة، وتقنية متطورة",
      engineEn: "1.6L Turbo",
      engineAr: "١.٦ لتر تيربو",
      stats: [
        { labelEn: "Max Power", labelAr: "القوة القصوى", value: "178 HP" },
        { labelEn: "Max Torque", labelAr: "عزم الدوران", value: "265 Nm" },
        { labelEn: "Seating", labelAr: "المقاعد", value: "5 Seats" },
        { labelEn: "Drive", labelAr: "الدفع", value: "2WD / 4WD" },
      ],
    },
    ...emptySections,
  },
];

export function getModelBySlug(slug: string): VehicleModel | null {
  return models.find((m) => m.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return models.map((m) => m.slug);
}

export function getModelsByCategory(category?: VehicleModel["category"]): VehicleModel[] {
  if (!category) return models;
  return models.filter((m) => m.category === category);
}
