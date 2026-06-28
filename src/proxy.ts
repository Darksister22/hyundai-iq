import { NextRequest, NextResponse } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "ar";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // skip internal paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return;
  }

  // check if pathname already has a locale
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|assets).*)"],
};
