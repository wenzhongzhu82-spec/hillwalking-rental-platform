import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hillwalking Rental | SCIE Gear Exchange",
  description:
    "The official SCIE hillwalking gear rental platform. Borrow and lend hiking boots, backpacks, tents, sleeping bags, and more — by students, for students. Affordable, sustainable, and adventure-ready.",
  keywords: [
    "hillwalking",
    "gear rental",
    "SCIE",
    "hiking equipment",
    "outdoor gear",
    "student rental",
    "camping",
    "Shenzhen",
  ],
  authors: [{ name: "SCIE Hillwalking Club" }],
  openGraph: {
    title: "Hillwalking Rental | SCIE Gear Exchange",
    description:
      "Borrow and lend hillwalking gear within the SCIE community. Affordable outdoor adventures start here.",
    type: "website",
    siteName: "SCIE Hillwalking Rental",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-foreground font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
