import { Reveal } from "@/components/reveal";

export function DressCodeSection() {
  return (
    <section id="dress-code" className="scroll-mt-24">
      <div className="relative overflow-hidden bg-burgundy-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[url('/gallery/burgundy-emboss-seamless.jpg')] bg-repeat bg-center bg-[length:240px_auto] sm:bg-[length:420px_auto] pointer-events-none select-none"
        />
        <div className="relative z-10 mx-auto max-w-xl px-6 py-20 sm:py-28 text-center">
          <Reveal>
            <p className="kicker text-base sm:text-lg text-gold-400 mb-3">Dress Code</p>
            <h2 className="font-heading text-[2.625rem] sm:text-[4.125rem] text-cream-100 tracking-tight">
              Formal Attire
            </h2>
            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
          </Reveal>
          <p className="mt-10 leading-relaxed text-cream-200">
            We ask that guests join us in formal attire. Think floor-length dresses, elegant
            eveningwear, or a tailored suit paired with a necktie or bowtie.
          </p>
        </div>
      </div>
    </section>
  );
}
