import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading"
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Repete Performance | Leadership Performance Coaching",
  description:
    "Repete Performance helps leaders fix the behavior patterns behind slower growth, poor decision-making, and stalled execution. Behavioral coaching led by Dr. Brian Peters, PhD in Industrial-Organizational Psychology.",
  openGraph: {
    title: "Repete Performance | Leadership Performance Coaching",
    description:
      "Fix the behavior patterns limiting your leadership. Behavioral coaching led by Dr. Brian Peters, PhD I-O Psychology.",
    type: "website",
    locale: "en_US",
    siteName: "Repete Performance"
  },
  twitter: {
    card: "summary_large_image",
    title: "Repete Performance | Leadership Performance Coaching",
    description:
      "Fix the behavior patterns limiting your leadership. Behavioral coaching led by Dr. Brian Peters."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} bg-[var(--color-bg)] font-[family:var(--font-body)] text-[var(--color-ink)] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
