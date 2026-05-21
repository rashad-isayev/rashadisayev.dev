import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
  title: {
    default: "Rashad Isayev",
    template: "%s | Rashad Isayev",
  },
  description:
    "Personal platform for Rashad Isayev: writing, projects, courses, books, and notes.",
  metadataBase: new URL("https://rashadisayev.com"),
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
