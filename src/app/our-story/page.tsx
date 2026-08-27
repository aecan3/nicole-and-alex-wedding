import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";
import { GalleryPlaceholder } from "@/components/gallery";

export default function OurStoryPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Coming soon" title="Our Story" />
      <div className="mx-auto max-w-2xl px-6 pb-24">
        <Reveal className="text-center">
          <p className="leading-relaxed text-burgundy-700/80">
            We&rsquo;re writing this one ourselves — check back soon.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-14">
          <GalleryPlaceholder />
        </Reveal>
      </div>
    </main>
  );
}
