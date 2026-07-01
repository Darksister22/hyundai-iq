import { getDictionary, Locale } from "@/lib/i18n";
import ParallaxImage from "@/components/parallax-image";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const t = dict.about;

  return (
    <>
      {/* ── Intro banner (full-bleed under the fixed header) ── */}
      <section className="relative h-[70vh] min-h-[460px] -mt-[72px] overflow-hidden">
        <ParallaxImage label="Intro image" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
          <nav className="text-xs text-white/80 flex items-center gap-2 self-start mb-4">
            <span>{t.home}</span><span>/</span>
            <span>{t.storyCrumb}</span><span>/</span>
            <span className="text-white">{t.title}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-white">{t.title}</h1>
        </div>
      </section>

      {/* ── Pill tabs (visual only) ── */}
      <div className="flex justify-center -mt-7 relative z-10">
        <div className="inline-flex bg-white shadow-md rounded-full p-1 text-sm">
          <span className="px-6 py-2 rounded-full bg-[#002C5F] text-white">{t.philosophyTab}</span>
          <span className="px-6 py-2 rounded-full text-gray-600">{t.historyTab}</span>
        </div>
      </div>

      {/* ── Big intro statement ── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] leading-snug">{t.intro}</h2>
        </div>
      </section>

      {/* ── Overview (text + image row) ── */}
      <Row
        label={t.overviewLabel}
        title={t.overviewTitle}
        body={t.overviewBody}
        img="Overview image"
      />

      {/* ── Quote band (dark, oversized background quote) ── */}
      <section className="relative bg-[#002C5F] text-white py-24 overflow-hidden">
        {/* giant translucent quote sits behind the copy */}
        <div className="absolute inset-0 flex items-center px-6 pointer-events-none">
          <p className="text-white/10 font-bold text-4xl md:text-6xl leading-tight max-w-3xl">
            “{t.progressQuote}”
          </p>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">
          <div className="lg:col-start-2">
            <h3 className="text-2xl font-bold mb-5">{t.progressTitle}</h3>
            <p className="text-white/80 leading-relaxed">{t.progressBody}</p>
          </div>
        </div>
      </section>

      {/* ── Founder quote (image + gray quote card) ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <ParallaxImage label="Founder image" className="h-[420px] rounded-xl mb-10" />
          <div className="bg-gray-50 p-10 md:p-14 relative">
            <span className="absolute top-6 end-8 text-[#002C5F] text-4xl">“</span>
            <blockquote className="text-2xl md:text-3xl font-bold text-[#002C5F] leading-relaxed max-w-3xl">
              {t.quote}
            </blockquote>
            <cite className="block mt-6 text-sm text-gray-500 not-italic">{t.quoteAuthor}</cite>
          </div>
        </div>
      </section>

      {/* ── "Around the corner" — text + image ── */}
      <Row title={t.cornerTitle} body={t.cornerBody} img="Corner image" />

      {/* ── "Next big thing" — image + text (reversed) ── */}
      <Row title={t.nextTitle} body={t.nextBody} img="Next image" reverse />

      {/* ── "Going our way" — text + image ── */}
      <Row title={t.wayTitle} body={t.wayBody} img="Way image" />
    </>
  );
}

// Alternating text/image row. `reverse` flips image to the start side.
function Row({
  label,
  title,
  body,
  img,
  reverse = false,
}: {
  label?: string;
  title: string;
  body: string;
  img: string;
  reverse?: boolean;
}) {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div className={reverse ? "lg:order-last" : ""}>
          {label && (
            <span className="text-xs uppercase tracking-[3px] text-[#00AAD2] font-semibold">
              {label}
            </span>
          )}
          <h3 className="text-2xl md:text-3xl font-bold text-[#002C5F] mt-3 mb-5">{title}</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">{body}</p>
        </div>
        <ParallaxImage label={img} className="h-80 lg:h-[440px] rounded-xl" />
      </div>
    </section>
  );
}