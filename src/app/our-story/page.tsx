import { PageHeader } from "@/components/page-header";

export default function OurStoryPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Coming soon" title="Our Story" />
      <div className="mx-auto max-w-xl px-6 pb-24 text-center">
        <p className="leading-relaxed text-burgundy-700/80">
          We&rsquo;re writing this one ourselves — check back soon.
        </p>
      </div>
    </main>
  );
}
