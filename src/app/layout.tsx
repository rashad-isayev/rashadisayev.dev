import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/constants/site";

import "./globals.css";

const inter = Inter({
  // The font is exposed as a CSS variable so Tailwind can reference it in globals.css.
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // The template is used by child routes that set their own title.
  // Example: "Admin" becomes "Admin | Rashad Isayev".
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png?v=3", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png?v=3", type: "image/png", sizes: "16x16" },
      { url: "/icon.png?v=3", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico?v=3", sizes: "any" },
    ],
    shortcut: ["/favicon.ico?v=3"],
    apple: [{ url: "/apple-touch-icon.png?v=3", type: "image/png", sizes: "180x180" }],
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/apple-touch-icon-precomposed.png?v=3" },
      { rel: "mask-icon", url: "/safari-pinned-tab.svg?v=3", color: "#f8fafc" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#080a12",
  },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
