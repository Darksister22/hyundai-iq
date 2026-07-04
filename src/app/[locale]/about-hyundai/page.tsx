import { getDictionary, Locale } from "@/lib/i18n";
import ParallaxImage from "@/components/parallax-image";
import Reveal from "@/components/reveal";

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
{/* ── Intro banner: 70vh, full-bleed under the fixed header ── */}
<section className="relative h-[80svh] min-h-[460px] -mt-[72px] overflow-hidden">
  <ParallaxImage src="/images/about-us.webp" priority className="absolute inset-0 h-full w-full" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
  <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16">
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
          <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] leading-snug">{t.intro}</h2>

          </Reveal>
        </div>
      </section>

      {/* ── Overview (text + image row) ── */}
      <Row
        label={t.overviewLabel}
        title={t.overviewTitle}
        body={t.overviewBody}
        img= "/images/philosophy.webp"
      />

{/* ── Quote band  */}
<section className="bg-[#002C5F] text-white py-16 md:py-24">
  <div className="max-w-7xl mx-auto px-6">
    {/* copy block */}
    <div className="max-w-3xl">
      <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">
        {t.progressTitle}
      </h3>
      <p className="text-white/80 leading-relaxed text-sm md:text-base">
        {t.progressBody}
      </p>
    </div>

    {/* big translucent quote below, with an opening quote mark on the side */}
    <div className="relative mt-10 md:mt-16">
      {/* oversized quotation mark, start-aligned (RTL-aware) */}
      <span className="absolute -top-6 md:-top-10 start-0 text-white/15 font-bold text-6xl md:text-8xl leading-none">
        “
      </span>
      <p className="text-white/15 font-bold text-3xl md:text-6xl leading-tight ps-10 md:ps-16">
        {t.progressQuote}
      </p>
    </div>
  </div>
</section>

 {/* ── Founder quote (full-width image + gray quote card) ── */}
<section className="py-20">
  {/* full-bleed: pull out to viewport edges, taller than the rows */}
  <ParallaxImage
    src="/images/founder.webp"
    label="Founder image"
    className="w-screen relative left-1/2 -translate-x-1/2 h-[560px] mb-10"
    // ↑ left-1/2 + -translate-x-1/2 centers a 100vw block regardless of container
  />
  <div className="max-w-7xl mx-auto px-6">
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
      <Row title={t.cornerTitle} body={t.cornerBody} img= "/images/row1.webp"  />

      {/* ── "Next big thing" — image + text (reversed) ── */}
      <Row title={t.nextTitle} body={t.nextBody}  reverse img="/images/row2.webp"/>

      {/* ── "Going our way" — text + image ── */}
      <Row title={t.wayTitle} body={t.wayBody} img="/images/row3.webp" />
    </>
  );
}

// Alternating text/image row. `reverse` flips image to the start side.
function Row({
  label,
  title,
  body,
  img,           // string path
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
  <Reveal>
    {label && (
      <span className="text-xs uppercase tracking-[3px] text-[#00AAD2] font-semibold">{label}</span>
    )}
    <h3 className="text-2xl md:text-3xl font-bold text-[#002C5F] mt-3 mb-5">{title}</h3>
    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{body}</p>
  </Reveal>
</div>
        {/* render the image, don't print the path */}
        <ParallaxImage src={img} className="h-80 lg:h-[440px] rounded-xl" />
      </div>
    </section>
  );
}