import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export function VenueSection() {
  return (
    <section
      id="venue"
      className="relative min-h-svh overflow-hidden scroll-mt-24"
    >
      {/* On the old standalone route this section's watermark sized itself
          off <main>'s flex-1 height, which filled the viewport (minus nav +
          footer) on every screen since the content here is short. Now that
          this is one section among nine with no flex-1 stretch behind it,
          min-h-svh reproduces that same roughly-full-viewport canvas so the
          locked desktop position and the tuned mobile position both render
          exactly as approved — the bg-size/bg-position percentages below are
          unchanged from the locked version. */}
      <PageHeader title="Alora Macedon" />

      {/* No top banner photo — the page opens straight into the text, and
          the same line-art rendering reappears further down as a faded
          watermark instead (see below). A plain CSS background-image,
          not an <Image>: it spans the whole of this section and bg-size/
          bg-position handle the sizing and bottom-right anchoring
          directly, so there's no absolute-offset arithmetic to get
          wrong and nothing to clip — it fills roughly the bottom-right
          two-thirds of the section at every screen size by construction. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/gallery/venue-atrium-watermark.png')] bg-no-repeat bg-[position:10%_bottom] bg-[length:135%_auto] opacity-[0.2] sm:bg-right-bottom sm:bg-[length:62%_auto]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-10 pb-20 text-center">
        <Reveal>
          <p className="text-lg leading-relaxed">
            Our ceremony and reception will be held at Alora Macedon, a
            Tuscan-inspired estate set among rolling hills at the base of
            Mount Macedon, about 60 minutes from Melbourne. Filled with
            romantic light, the private grounds offer a beautiful, intimate
            backdrop for our day.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-10 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-taupe-600">Address</p>
            <p className="mt-1">330 Barringo Road<br />New Gisborne, VIC</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
