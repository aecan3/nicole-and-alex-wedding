import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export default function DressCodePage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Formal" title="Black Tie Optional" />
      <div className="mx-auto max-w-xl px-6 pb-20 text-center space-y-8">
        <p className="leading-relaxed">
          We&rsquo;d love for you to dress up with us. Think formal &mdash; black tie
          optional.
        </p>

        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-[500/620] w-full max-w-[280px]">
            <Image
              src="/gallery/dress-code-sketch.svg"
              alt="Sketch of a man in a suit and a woman in a long formal gown"
              fill
              className="object-contain"
            />
          </div>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 text-left">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-olive-700">For the Gents</p>
            <p className="mt-2">A sharp suit and tie (or, if you have one, a tux).</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-olive-700">For the Ladies</p>
            <p className="mt-2">A long, formal dress.</p>
          </div>
        </div>
        <p className="text-sm text-burgundy-600/80">
          Our wedding is indoors, so no need to worry about grass or gravel underfoot.
        </p>
      </div>
    </main>
  );
}
