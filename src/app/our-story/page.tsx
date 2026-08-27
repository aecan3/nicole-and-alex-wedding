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
      </div>
    </main>
  );
}
