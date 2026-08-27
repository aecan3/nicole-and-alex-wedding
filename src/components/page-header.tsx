export function PageHeader({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
      {kicker && (
        <p className="text-xs tracking-[0.3em] uppercase text-olive-700 mb-3">{kicker}</p>
      )}
      <h1 className="font-display text-4xl sm:text-5xl text-burgundy-800">{title}</h1>
      <div className="mx-auto mt-5 h-px w-16 bg-gold-400" />
    </div>
  );
}
