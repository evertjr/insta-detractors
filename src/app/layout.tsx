import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Insta Falsianes",
  description: "Descubra quem não está te seguindo de volta de forma segura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={GeistSans.className}>{children}</body>
      <Analytics />
    </html>
  );
}
