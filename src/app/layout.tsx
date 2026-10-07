import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_Arabic } from "next/font/google";

import { DirectionProvider } from "@/components/ui/direction";

import { Providers } from "./providers";
import "./globals.css";

const fontSans = Noto_Sans_Arabic({
  subsets: ["arabic", "latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "كاشير — نقطة البيع",
    template: "%s | كاشير",
  },
  description: "نظام نقاط بيع: مبيعات ومخزون وفواتير وتقارير",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${fontSans.variable} ${fontMono.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <DirectionProvider dir="rtl">
          <Providers>{children}</Providers>
        </DirectionProvider>
      </body>
    </html>
  );
}
