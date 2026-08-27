import { PageHeader } from "@/components/page-header";

export default function RegistryPage() {
  return (
    <main className="flex-1">
      <PageHeader kicker="Draft — for your review" title="Registry" />
      <div className="mx-auto max-w-xl px-6 pb-20 text-center space-y-6">
        <p className="leading-relaxed">
          Your presence at our wedding is the greatest gift of all, and having you
          there to celebrate with us is truly all we need.
        </p>
        <p className="leading-relaxed">
          For those who&rsquo;d still like to give something, we&rsquo;re skipping a
          traditional registry and putting together a wishing well instead, to help
          us on our way into married life together.
        </p>
        <p className="text-sm text-burgundy-700/80">
          [Draft note: happy to adjust the tone here, or tie it to something specific
          like the honeymoon — let me know what feels right and I'll finalise the wording
          and add bank details / a QR code once you're ready.]
        </p>
      </div>
    </main>
  );
}
