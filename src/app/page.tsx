import { SiteHeader } from "@/components/site-header";
import { QuoteCarousel } from "@/components/quote-carousel";
import DarkVeil from "@/components/dark-veil";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <DarkVeil />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 bg-background/45" />
      <SiteHeader />

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-4xl px-6 pt-24 pb-16">
          <p className="mb-4 font-mono text-sm text-zinc-400">
            hello, I&apos;m
          </p>
          <h1 className="text-4xl font-bold tracking-tight italic sm:text-6xl">
            {profile.name}
            <span className="text-zinc-500">.</span>
          </h1>
          <QuoteCarousel />
        </section>

        <section
          id="about"
          className="mx-auto w-full max-w-4xl scroll-mt-20 px-6 pb-24"
        >
          <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            About
          </h2>

          <div className="grid gap-12 md:grid-cols-[1fr_260px]">
            <div className="space-y-4 text-base leading-relaxed text-zinc-300">
              {profile.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800/70">
        <div className="mx-auto w-full max-w-4xl px-6 py-6 text-center">
          <p className="font-mono text-xs text-zinc-500">
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}