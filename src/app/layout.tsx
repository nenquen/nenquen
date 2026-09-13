import type { Metadata } from "next";
import { Varela_Round, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AchievementProvider } from "@/components/achievement-provider";
import { AchievementOverlay } from "@/components/achievement-overlay";

const varela = Varela_Round({
  weight: "400",
  variable: "--font-varela",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nen's Stuff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" className={`${varela.variable} ${geistMono.variable}`}>
      <body
        className={`min-h-full flex flex-col antialiased select-none font-sans`}
      >
        <AchievementProvider>
          {children}
          <AchievementOverlay />
        </AchievementProvider>
      </body>
    </html>
  );
}