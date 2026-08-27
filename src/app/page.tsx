import { Monogram } from "@/components/nav";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center text-center px-6">
      <div className="mt-14 mb-8">
        <Monogram />
      </div>
      <p className="text-xs tracking-[0.35em] uppercase text-olive-700">Thursday</p>
      <h1 className="font-display text-3xl sm:text-4xl text-burgundy-800 mt-2">11 March 2027</h1>
      <p className="mt-3 text-burgundy-700">Alora Macedon, New Gisborne, Victoria</p>

      <p className="max-w-xl mt-10 text-lg leading-relaxed text-burgundy-900">
        We&rsquo;re absolutely thrilled to celebrate our big day with you at Alora Macedon,
        New Gisborne.
      </p>

      <Link
        href="/rsvp"
        className="mt-10 inline-block rounded-full bg-burgundy-800 text-cream-100 px-10 py-3 text-sm tracking-[0.2em] uppercase hover:bg-burgundy-700 transition-colors"
      >
        RSVP
      </Link>

      <div className="mt-20 mb-16 h-px w-24 bg-olive-500" />
    </main>
  );
}
