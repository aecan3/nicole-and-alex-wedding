import { PageHeader } from "@/components/page-header";

export function RegistrySection() {
  return (
    <section id="registry" className="scroll-mt-24">
      <PageHeader kicker="With Love" title="Gifts" />
      <div className="mx-auto max-w-xl px-6 pb-20 text-center space-y-6">
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
    </section>
  );
}
