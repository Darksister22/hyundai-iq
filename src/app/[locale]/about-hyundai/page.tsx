import { getDictionary, Locale } from "@/lib/i18n";
import ImageWithLoader from "@/components/loaders/loading-image";
import Reveal from "@/components/reveal";
import { type Metadata } from "next";
import AboutTabs from "@/components/about-tabs";
import ParallaxLoader from "@/components/loaders/parallax-loader";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = (await getDictionary(locale as Locale)).about;

  return {
    title: t.title,
    description: t.subtitle,
    alternates: { canonical: `/${locale}/about-us` },
  };
}

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
      {/* Intro banner */}
      <section className="relative h-[60lvh] min-h-[460px] -mt-[72px] overflow-hidden bg-gray-200">
        <ImageWithLoader src="/images/about-us.webp" alt={t.home} fill className="object-cover object-center" />
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

      {/* Tabs (philosophy / history) — client component.
          Philosophy content is passed in so it stays server-rendered. */}
      <AboutTabs
        dict={{
          philosophyTab: t.philosophyTab,
          historyTab: t.historyTab,
          historyIntro: t.historyIntro,
        }}
        milestones={t.milestones}
        philosophy={
          <>
            {/* Intro statement — aligned by language (start edge), not centered */}
            <section className="py-20">
              <div className="max-w-4xl px-6 ms-0 me-auto">
                <Reveal>
                  <h2 className="w-full text-3xl md:text-4xl font-bold text-[#111] leading-snug text-start">
                    {t.intro}
                  </h2>
                </Reveal>
              </div>
            </section>

            {/* Overview — full-screen, image on top for mobile, all-black text,
                straight (non-rounded) edges */}
            <section className="min-h-[80lvh] grid grid-cols-1 lg:grid-cols-2 items-stretch">
              {/* image: on top on mobile (order-first), side on desktop */}
              <div className="relative min-h-[45lvh] lg:min-h-0 order-first lg:order-none">
                <ParallaxLoader src="/images/philosophy.webp" alt={t.overviewTitle} />
              </div>
              {/* text: all black */}
              <div className="flex items-center bg-white">
                <div className="w-full max-w-xl mx-auto px-6 md:px-12 py-16">
                  <Reveal>
                    {t.overviewLabel && (
                      <span className="text-xs uppercase tracking-[3px] text-[#111] font-semibold">
                        {t.overviewLabel}
                      </span>
                    )}
                    <h2 className="text-2xl md:text-4xl font-bold text-[#111] mt-3 mb-5">
                      {t.overviewTitle}
                    </h2>
                    <p className="text-[#111] leading-relaxed whitespace-pre-line">
                      {t.overviewBody}
                    </p>
                  </Reveal>
                </div>
              </div>
            </section>

            {/* Quote band — with left/right margins */}
            <section className="bg-[#002C5F] text-white py-16 md:py-24 mx-4 md:mx-8 mt-16 md:mt-24">
              <div className="max-w-7xl mx-auto px-6">
                <div className="max-w-3xl">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-5">{t.progressTitle}</h3>
                  <p className="text-white/80 leading-relaxed text-sm md:text-base">{t.progressBody}</p>
                </div>
                <div className="relative mt-10 md:mt-16">
                  <span className="absolute -top-6 md:-top-10 start-0 text-white/15 font-bold text-6xl md:text-8xl leading-none">
                    &ldquo;
                  </span>
                  <p className="text-white/15 font-bold text-3xl md:text-6xl leading-tight ps-10 md:ps-16">
                    {t.progressQuote}
                  </p>
                </div>
              </div>
            </section>

            {/* Founder image — full-bleed, straight edges, takes most of the screen */}
            <section className="pt-20">
              <div className="relative w-[100vw] left-1/2 -translate-x-1/2 h-[70lvh] min-h-[400px] overflow-hidden bg-gray-200">
                <ParallaxLoader src="/images/founder.webp" alt="Founder"  />
              </div>
            </section>

            {/* Commitment section — side label + heading + body (matches reference) */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-[9rem_1fr] gap-4 md:gap-10">
                <p className="text-sm text-gray-400 md:pt-2">
                  {t.commitmentLabel}
                </p>
                <div>
                  <h2 className="text-2xl md:text-4xl font-bold text-[#111] mb-6 leading-snug">
                    {t.commitmentHeading}
                  </h2>
                  <p className="text-gray-600 leading-loose text-start max-w-3xl">
                    {t.commitmentBody}
                  </p>
                </div>
              </div>
            </section>

            {/* image before commitment */}
            <section className="pt-16">
              <div className="relative w-[100vw] left-1/2 -translate-x-1/2 h-[60lvh] min-h-[460px] overflow-hidden bg-gray-200">
                <ParallaxLoader src="/images/IONIQ_9_3.webp" alt=""  />
              </div>
            </section>
            {/* Block quote — with its own large image before it; the two
                together fill most of the screen. Straight edges, side margins. */}
            <section className="pb-20">
              <div className="max-w-7xl mx-auto px-6">
                <div className="bg-gray-50 p-10 md:p-14 mx-4 md:mx-8 relative min-h-[45lvh] flex flex-col justify-center">
                  <span className="absolute top-6 end-8 text-[#002C5F] text-4xl">&ldquo;</span>
                  <blockquote className="text-2xl md:text-3xl font-bold text-[#002C5F] leading-relaxed max-w-3xl">
                    {t.quote}
                  </blockquote>
                  <cite className="block mt-6 text-sm text-gray-500 not-italic">{t.quoteAuthor}</cite>
                </div>
              </div>
            </section>

            {/* Alternating image + text rows — tighter spacing, straight edges */}
            <Row title={t.cornerTitle} body={t.cornerBody} img="/images/row1.webp" />
            <Row title={t.nextTitle} body={t.nextBody} reverse img="/images/row2.webp" />
            <Row title={t.wayTitle} body={t.wayBody} img="/images/row3.webp" />
          </>
        }
      />
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
    <section className="py-2 lg:py-3">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        <div className={reverse ? "lg:order-last" : ""}>
          <Reveal>
            {label && (
              <span className="text-xs uppercase tracking-[3px] text-[#00AAD2] font-semibold">{label}</span>
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-[#002C5F] mt-3 mb-5">{title}</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{body}</p>
          </Reveal>
        </div>
        {/* straight edges (no rounded), relative wrapper for the fill image */}
        <div className="relative h-80 lg:h-[440px] overflow-hidden bg-gray-100">
          <ParallaxLoader src={img} alt={title}  />
        </div>
      </div>
    </section>
  );
}