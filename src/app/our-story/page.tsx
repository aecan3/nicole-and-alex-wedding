import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { Gallery } from "@/components/gallery";

const photos = [
  { type: "video" as const, src: "/gallery/proposal.mp4", alt: "The proposal" },
  { type: "image" as const, src: "/gallery/couple-rooftop.jpg", alt: "Nicole and Alex laughing together" },
  { type: "image" as const, src: "/gallery/couple-sunset.jpg", alt: "Nicole and Alex embracing at sunset" },
  { type: "image" as const, src: "/gallery/couple-garden.jpg", alt: "Nicole and Alex in the garden" },
  { type: "image" as const, src: "/gallery/couple-beach.jpg", alt: "Nicole and Alex at the beach" },
  { type: "image" as const, src: "/gallery/couple-christmas.jpg", alt: "Nicole and Alex at Christmas" },
];

export default function OurStoryPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Coming soon" title="Our Story" />
      <div className="mx-auto max-w-2xl px-6 pb-24">
        <Reveal className="text-center">
          <p className="leading-relaxed text-burgundy-700/80">
            We&rsquo;re writing this one ourselves — check back soon. Tap the first
            tile below for how it actually happened.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-14">
          <Gallery items={photos} />
        </Reveal>

        <Reveal delay={0.1} className="mt-24 text-center">
          <p className="kicker text-base sm:text-lg text-olive-700 mb-3">
            Every love story
          </p>
          <h2 className="font-display text-2xl sm:text-3xl text-burgundy-800">
            Has a third wheel
          </h2>
          <p className="mt-4 leading-relaxed text-burgundy-700/80 max-w-lg mx-auto">
            Ours happens to have four legs and a very good sense for when
            someone needs cheering up.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 max-w-md mx-auto">
          <Gallery
            items={[
              { type: "image", src: "/gallery/dog-christmas.jpg", alt: "Their dog on Christmas Day" },
              { type: "image", src: "/gallery/dog-portrait.jpg", alt: "Their dog in the garden" },
            ]}
          />
        </Reveal>
      </div>
    </main>
  );
}
