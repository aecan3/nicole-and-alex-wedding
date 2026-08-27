import { PageHeader } from "@/components/page-header";

export default function RsvpPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="By 24 January 2027" title="RSVP" />
      <div className="mx-auto max-w-xl px-6 pb-24 text-center">
        <p className="leading-relaxed text-burgundy-700/80">
          The RSVP form is being wired up now — check back shortly.
        </p>
      </div>
    </main>
  );
}
