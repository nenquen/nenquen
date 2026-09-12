import { SiteHeader } from "@/components/site-header";
import { QuoteCarousel } from "@/components/quote-carousel";
import CRTWarp from "@/components/CRTWarp";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-20">
        <CRTWarp
          color="#e9b6ff"
          backgroundColor="#05010a"
          speed={0.4}
          curvature={0}
          scanlineStrength={1}
          scanlineFrequency={200}
          waveAmplitude={0.25}
          waveFrequency={3}
          bloom={1.5}
          bloomRadius={1}
          noise={0}
          vignette={0.8}
          brightness={1.25}
          pixelation={1}
          rgbShift={0}
          mouseReact={false}
          mouseStrength={0}
          dpr={1}
          fps={60}
        />
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