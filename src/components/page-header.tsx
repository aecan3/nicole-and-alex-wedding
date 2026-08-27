import { Reveal } from "@/components/reveal";

export function PageHeader({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
      <Reveal>
        {kicker && (
          <p className="kicker text-base sm:text-lg text-olive-700 mb-3">{kicker}</p>
        )}
        <h1 className="font-display text-4xl sm:text-6xl text-burgundy-600 tracking-tight">{title}</h1>
        <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      </Reveal>
    </div>
  );
}
