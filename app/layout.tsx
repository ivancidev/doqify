import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { AuthProvider } from "@/components/providers/AuthContext";
import { I18nProvider } from "@/lib/i18n/I18nContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "doqify — Ask your documents anything",
  description: "Upload any document and query it from the web or WhatsApp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#fafafa] antialiased">
        <I18nProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
