import Link from "next/link";
import { Hero } from "@/components/hero";
import { Reveal } from "@/components/reveal";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero photoSrc="/gallery/couple-rooftop.jpg" />

      <section className="px-6 py-28 sm:py-36 text-center">
        <Reveal>
          <p className="kicker text-base sm:text-lg text-olive-700">
            Together with our families
          </p>
          <p className="max-w-xl mx-auto mt-7 text-2xl sm:text-3xl leading-relaxed font-display italic text-burgundy-900">
            We&rsquo;re absolutely thrilled to celebrate our big day with you at
            Alora Macedon, New Gisborne.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/rsvp"
            className="mt-11 inline-block rounded-full bg-burgundy-800 text-cream-100 px-10 py-3.5 text-sm tracking-[0.25em] uppercase transition-all duration-300 hover:bg-burgundy-950 hover:shadow-[0_8px_30px_rgba(74,21,33,0.25)]"
          >
            RSVP
          </Link>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-20 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-olive-500 to-transparent" />
        </Reveal>
      </section>
    </main>
  );
}
