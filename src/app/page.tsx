import Link from "next/link";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <section className="px-6 py-24 sm:py-32 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.35em] uppercase text-olive-700">
            Together with our families
          </p>
          <p className="max-w-xl mx-auto mt-6 text-xl sm:text-2xl leading-relaxed font-display text-burgundy-900">
            We&rsquo;re absolutely thrilled to celebrate our big day with you at
            Alora Macedon, New Gisborne.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/rsvp"
            className="mt-10 inline-block rounded-full bg-burgundy-800 text-cream-100 px-10 py-3 text-sm tracking-[0.2em] uppercase hover:bg-burgundy-700 transition-colors"
          >
            RSVP
          </Link>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-20 mx-auto h-px w-24 bg-olive-500" />
        </Reveal>
      </section>
    </main>
  );
}
