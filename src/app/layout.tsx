import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontGrotesk = localFont({
  src: "../../public/fk-grotesk.woff2",
  variable: "--font-grotesk",
});


export const metadata: Metadata = {
  title: "JusticeJet - AI Legal Defense Platform",
  description: "From intake to action in 60 seconds. AI-powered legal defense analysis for pro bono attorneys handling evictions, wage theft, debt collection, and immigration cases.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontGrotesk.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
