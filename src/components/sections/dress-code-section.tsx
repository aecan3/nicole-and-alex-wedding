import { Reveal } from "@/components/reveal";

// This section used to run through the shared PageHeader (burgundy text on
// the plain cream page, like every other section). It's now a solid
// burgundy field of its own — the mockup that got approved for this — to
// give the dress code a bit of visual separation from the sections either
// side of it, so it isn't reusing PageHeader here: that component hardcodes
// burgundy-600 heading text and a taupe kicker, both meant for a cream
// background, and the whole point of this section is the color flip
// (cream/gold text on burgundy instead of burgundy text on cream). The
// radial gradient (burgundy-800 fading down to burgundy-950) gives the
// field a touch of depth rather than a single flat fill; no border/divider
// treatment between this and the cream sections above/below for now.
export function DressCodeSection() {
  return (
    <section id="dress-code" className="scroll-mt-24">
      <div className="bg-[radial-gradient(ellipse_140%_100%_at_50%_0%,var(--color-burgundy-800)_0%,var(--color-burgundy-900)_55%,var(--color-burgundy-950)_100%)]">
        <div className="mx-auto max-w-xl px-6 py-20 sm:py-28 text-center">
          <Reveal>
            <p className="kicker text-base sm:text-lg text-gold-400 mb-3">Dress Code</p>
            <h2 className="font-display text-4xl sm:text-6xl text-cream-100 tracking-tight">
              Formal Attire
            </h2>
            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          </Reveal>

          <div className="mt-10 space-y-8">
            <p className="leading-relaxed text-cream-200">
              We&rsquo;d love for you to dress up and celebrate in style with us.
            </p>

            <div className="grid gap-8 sm:grid-cols-2 text-left">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-400">For the Gents</p>
                <p className="mt-2 text-cream-100">Tailored suit with a tie or bow tie.</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gold-400">For the Ladies</p>
                <p className="mt-2 text-cream-100">A floor-length dress or formal eveningwear.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
