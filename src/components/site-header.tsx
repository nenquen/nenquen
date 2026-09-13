"use client";

import Link from "next/link";
import { useState, useRef } from "react";

import { profile } from "@/data/profile";
import { useAchievements } from "./achievement-provider";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37.07.07 0 0 0 3.66 4.43C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.019-.02ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.585 0-.29-.015-1.065-.015-2.07-3.015.6-3.795-1.485-3.795-1.485-.495-1.26-1.205-1.605-1.205-1.605-.99-.675.06-.675.06-.675 1.095.075 1.665 1.125 1.665 1.125.975 1.665 2.55 1.185 3.18.9.09-.705.375-1.185.69-1.455-2.415-.27-4.95-1.2-4.95-5.355 0-1.2.42-2.16 1.125-2.925-.135-.27-.495-1.38.09-2.865 0 0 .9-.27 2.955 1.11.855-.24 1.77-.36 2.685-.36.915 0 1.83.12 2.685.36 2.055-1.38 2.955-1.11 2.955-1.11.585 1.485.225 2.595.09 2.865.705.765 1.125 1.725 1.125 2.925 0 4.17-2.535 5.085-4.95 5.355.39.345.735 1.005.735 2.025 0 1.455-.015 2.625-.015 2.985 0 .315.225.69.825.57A12.015 12.015 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

const pillBase =
  "group flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 sm:px-4 text-sm font-medium transition-all duration-300";

export function SiteHeader() {
  const { incrementClickCount } = useAchievements();
  const [streak, setStreak] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    const audio = new Audio("/sounds/sixseven.mp3");
    audio.play().catch(() => {});
    
    // Increment the counter for the achievement
    incrementClickCount();
    
    // Handle streak UI
    setStreak((prev) => prev + 1);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setStreak(0);
    }, 1500); // Reset streak after 1.5 seconds of inactivity
  };

  return (
    <header className="sticky top-4 z-10 mx-4 mt-4 flex justify-center [text-shadow:none]">
      <div className="relative flex w-full max-w-4xl items-center gap-2 overflow-hidden rounded-full border border-white/10 border-t-white/25 bg-white/5 bg-gradient-to-b from-white/10 to-transparent p-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] backdrop-blur-2xl backdrop-saturate-200 before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:rounded-t-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50">
        <Link href="/" onClick={handleLogoClick} className="relative z-10 flex self-center pl-4 pr-2 font-boblox text-3xl font-normal tracking-tighter transition-transform hover:scale-105 active:scale-95">
          <span
            className="-translate-y-[2px] text-white"
            style={{
              textShadow:
                "-1px -1px 0 #9163cb, 1px -1px 0 #9163cb, -1px 1px 0 #9163cb, 1px 1px 0 #9163cb, 0 2px 0 #9163cb, 0 3px 0 #9163cb, 0 4px 4px rgba(0,0,0,0.3)",
            }}
          >
            67
          </span>
        </Link>

        {/* Streak Indicator */}
        <div 
          className={`pointer-events-none absolute left-20 z-20 transition-all duration-300 ease-out ${
            streak > 1 ? 'translate-x-0 opacity-100 scale-100' : '-translate-x-4 opacity-0 scale-75'
          }`}
        >
          <div className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] backdrop-blur-md">
            {streak} Clicks
          </div>
        </div>
        <div className="relative z-10 ml-auto flex items-center gap-2">
          <Link
            href="/discord"
            className={`${pillBase} border border-[#5865F2]/30 bg-[#5865F2]/10 text-[#a5b0ff] shadow-[inset_0_1px_0_0_rgba(88,101,242,0.4)] hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 hover:text-white hover:shadow-[0_0_15px_rgba(88,101,242,0.4),inset_0_1px_0_0_rgba(88,101,242,0.6)]`}
          >
            <DiscordIcon className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
            <span className="hidden sm:inline">Discord</span>
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pillBase} border border-white/10 bg-white/5 text-zinc-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:bg-white/10 hover:border-white/20 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.1),inset_0_1px_0_0_rgba(255,255,255,0.2)]`}
          >
            <GitHubIcon className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}