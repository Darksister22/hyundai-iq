import localFont from "next/font/local";


export const textHyundai = localFont({
  src: [
    { path: "../fonts/latin/HyundaiSansText-Regular.woff2",      weight: "400", style: "normal" },
    { path: "../fonts/latin/HyundaiSansText-Italic.woff2",       weight: "400", style: "italic" },
    { path: "../fonts/latin/HyundaiSansText-Medium.woff2",       weight: "500", style: "normal" },
    { path: "../fonts/latin/HyundaiSansText-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/latin/HyundaiSansText-Bold.woff2",         weight: "700", style: "normal" },
    { path: "../fonts/latin/HyundaiSansText-BoldItalic.woff2",   weight: "700", style: "italic" },
  ],
  variable: "--font-text",
  display: "swap",
  adjustFontFallback: false, 
});

export const headHyundai = localFont({
  src: [
    { path: "../fonts/latin/HyundaiSansHead-Light.woff2",   weight: "300", style: "normal" },
    { path: "../fonts/latin/HyundaiSansHead-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/latin/HyundaiSansHead-Medium.woff2",  weight: "500", style: "normal" },
    { path: "../fonts/latin/HyundaiSansHead-Bold.woff2",    weight: "700", style: "normal" },
  ],
  variable: "--font-head",
  display: "swap",
  adjustFontFallback: false,
});

// Arabic + Kurdish
export const arabic = localFont({
  src: [
    { path: "../fonts/arabic/Rabar_038.woff2", weight: "400", style: "normal" },
    { path: "../fonts/arabic/Rabar_042.woff2", weight: "500", style: "normal" },
    { path: "../fonts/arabic/Rabar_043.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ar",
  display: "swap",
  adjustFontFallback: false,
});