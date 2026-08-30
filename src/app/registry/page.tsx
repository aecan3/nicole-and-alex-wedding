import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export default function RegistryPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="With Love" title="Gifts" />
      <div className="mx-auto max-w-xl px-6 pb-20 text-center space-y-6">
        <Reveal>
          <div className="relative mx-auto aspect-[300/260] w-full max-w-[220px]">
            <Image
              src="/gallery/wishing-well-sketch.svg"
              alt="Sketch of a wishing well"
              fill
              className="object-contain"
            />
          </div>
        </Reveal>
        <p className="leading-relaxed">
          Your presence at our wedding is the greatest gift of all, and having you
          there to celebrate with us is truly all we need.
        </p>
        <p className="leading-relaxed">
          For those who&rsquo;d still like to give something, we&rsquo;ve decided to
          skip a traditional gift registry. Instead, we&rsquo;re asking for
          contributions to our wishing well, to help us start our married life
          together. However you&rsquo;d like to give, it will be truly appreciated.
        </p>
      </div>
    </main>
  );
}
