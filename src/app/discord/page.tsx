import type { Metadata } from "next";
import Image from "next/image";

import { ClientCRTWarp } from "@/components/client-crt-warp";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Nen's Stuff",
};

export const revalidate = 3600;

const INVITE_CODE = "qTjFD8zhyz";

type InviteData = {
  guild?: {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    splash: string | null;
  };
  approximate_member_count?: number;
  approximate_presence_count?: number;
};

function cdnAsset(
  kind: "icons" | "banners" | "splashes",
  id: string,
  hash: string | null,
  ext: "png" | "gif" = "png",
) {
  if (!hash) return null;
  const format = hash.startsWith("a_") && ext === "gif" ? "gif" : "png";
  return `https://cdn.discordapp.com/${kind}/${id}/${hash}.${format}`;
}

async function getInvite(): Promise<InviteData | null> {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`,
    );
    if (!res.ok) return null;
    return (await res.json()) as InviteData;
  } catch {
    return null;
  }
}

export default async function DiscordPage() {
  const invite = await getInvite();

  const guild = invite?.guild;
  const avatarUrl = guild && cdnAsset("icons", guild.id, guild.icon, "gif");
  const memberCount = invite?.approximate_member_count;

  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <ClientCRTWarp />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-background/45" />

      <SiteHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <section className="w-full max-w-md">
          <p className="mb-4 font-mono text-sm text-zinc-400">join us on</p>
          <h1 className="font-discord text-3xl font-bold tracking-widest sm:text-4xl">
            Discord
          </h1>

          <div className="relative mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg [text-shadow:none]">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-4">
                {avatarUrl ? (
                  <Image
                    src={`${avatarUrl}?size=128`}
                    alt={guild?.name ?? "Discord server"}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-full ring-2 ring-[#5865F2]/40"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#5865F2]/20 text-[#5865F2] ring-2 ring-[#5865F2]/40">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37.07.07 0 0 0 3.66 4.43C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.019-.02ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-zinc-200">
                    {guild?.name ?? "Discord Server"}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-400">
                    {memberCount !== undefined && (
                      <span className="flex items-center gap-1.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                        </svg>
                        {memberCount.toLocaleString()} members
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="font-mono text-xs tracking-wider text-zinc-300 select-all cursor-copy">
                  discord.gg/{INVITE_CODE}
                </p>
              </div>

              <a
                href={profile.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center rounded-full border border-[#5865F2]/30 bg-[#5865F2]/10 px-4 py-2 text-sm font-medium text-[#a5b0ff] transition-all duration-300 hover:border-[#5865F2]/50 hover:bg-[#5865F2]/20 hover:text-white hover:shadow-[0_0_15px_rgba(88,101,242,0.4)]"
              >
                Join the server
              </a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}