import { Reveal } from "@/components/reveal";

// Renders an <h2>, not an <h1> — the site is now one continuous-scroll page
// with a single <h1> (the hero's "Nicole & Alex"), so every section heading
// below it demotes a level to keep one correct heading outline for screen
// readers, the way it would on any normal page with one title and several
// subsections.
export function PageHeader({
  title,
  kicker,
  // Script caps read optically smaller than lowercase at the same px, so a
  // short heading like "Rsvp" needs a bump to carry the same weight as the
  // word-based titles. Default matches every other section.
  titleSize = "text-4xl sm:text-6xl",
}: {
  title: string;
  kicker?: string;
  titleSize?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-20 pb-10 text-center">
      <Reveal>
        {kicker && (
          <p className="kicker text-base sm:text-lg text-taupe-600 mb-3">{kicker}</p>
        )}
        <h2 className={`font-heading ${titleSize} text-burgundy-600 tracking-tight`}>{title}</h2>
        <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
      </Reveal>
    </div>
  );
}
