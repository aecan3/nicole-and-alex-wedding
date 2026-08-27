import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Welcome" },
  { href: "/our-story", label: "Our Story" },
  { href: "/venue", label: "Venue" },
  { href: "/timetable", label: "Timetable" },
  { href: "/where-to-stay", label: "Where to Stay" },
  { href: "/travel", label: "Travel" },
  { href: "/dress-code", label: "Dress Code" },
  { href: "/registry", label: "Registry" },
  { href: "/faq", label: "Q&A" },
];

export function SiteNav() {
  return (
    <header className="bg-burgundy-800 text-cream-100">
      <div className="mx-auto max-w-5xl px-6 py-8 flex flex-col items-center gap-6">
        <Link href="/" className="font-script text-5xl sm:text-6xl text-cream-100">
          Nicole &amp; Alex
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm tracking-wide uppercase">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold-300 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Monogram({ className = "h-40 w-40 text-gold-300" }: { className?: string }) {
  return (
    <Image
      src="/brand/monogram.svg"
      alt="N & A monogram"
      width={220}
      height={220}
      className={className}
      priority
    />
  );
}
