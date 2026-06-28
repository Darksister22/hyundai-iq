import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hyundai Iraq",
  description:
    "Hyundai Iraq — Sedan, SUV, Electric & MPV vehicles. Explore models, book a test drive, and find your nearest showroom.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // the [locale] layout handles <html> and <body>
  return children;
}
