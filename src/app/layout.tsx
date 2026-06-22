import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "JazzyVault — Convert. Store. Secure. Smarter.",
    template: "%s | JazzyVault",
  },
  description:
    "JazzyVault is a secure AI-powered document vault. Upload, convert, store, organize, and intelligently analyze your documents in the cloud.",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    title: "JazzyVault — Convert. Store. Secure. Smarter.",
    description:
      "Secure AI-powered document vault for upload, conversion, storage, and intelligent document analysis.",
    siteName: "JazzyVault",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-brand-bg text-brand-textPrimary min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
