import { SiteHeader } from "@/components/site-header";
import { QuoteCarousel } from "@/components/quote-carousel";
import { ClientCRTWarp } from "@/components/client-crt-warp";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <ClientCRTWarp />
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
      </main>

    </div>
  );
}