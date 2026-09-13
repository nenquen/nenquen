import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AchievementProvider } from "@/components/achievement-provider";
import { AchievementOverlay } from "@/components/achievement-overlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
    <html lang="en" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased select-none`}
      >
        <AchievementProvider>
          {children}
          <AchievementOverlay />
        </AchievementProvider>
      </body>
    </html>
  );
}