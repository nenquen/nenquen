import Link from "next/link";

import { profile } from "@/data/profile";

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
  "flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-150";

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-10 mx-4 mt-4 flex justify-center">
      <div className="flex w-full max-w-4xl items-center gap-2 rounded-full border border-zinc-800/70 bg-zinc-900/40 p-1.5 shadow-lg shadow-black/20 backdrop-blur-2xl backdrop-saturate-150">
        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/discord"
            className={`${pillBase} bg-[#5865F2] text-white shadow-sm hover:bg-[#4752c4]`}
          >
            <DiscordIcon className="h-4 w-4" />
            Discord
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pillBase} bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`}
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}