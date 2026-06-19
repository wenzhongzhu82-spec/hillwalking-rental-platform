import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hillwalking Rental | Peer-to-Peer Outdoor Gear",
  description:
    "Rent hillwalking and outdoor gear from people in your community. Peer-to-peer gear rental platform.",
  keywords: [
    "hillwalking",
    "gear rental",
    "hiking equipment",
    "outdoor gear",
    "peer-to-peer rental",
    "camping",
    "community rental",
  ],
  authors: [{ name: "Hillwalking Rental Platform" }],
  openGraph: {
    title: "Hillwalking Rental | Peer-to-Peer Outdoor Gear",
    description:
      "Rent hillwalking and outdoor gear from people in your community. Affordable outdoor adventures start here.",
    type: "website",
    siteName: "Hillwalking Rental",
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
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col bg-cream text-foreground font-sans">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1E3D1A",
              color: "#FEFDF9",
              border: "1px solid #2D5A27",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
            },
            success: {
              iconTheme: { primary: "#F4A340", secondary: "#1E3D1A" },
            },
            error: {
              iconTheme: { primary: "#DC2626", secondary: "#FEFDF9" },
            },
          }}
        />
      </body>
    </html>
  );
}
