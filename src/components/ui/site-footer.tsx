import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="pb-10 pt-16">
      <div className="container-shell">
        <div className="section-frame grid gap-8 rounded-[2rem] px-6 py-10 md:grid-cols-[1.4fr_1fr] md:px-10">
          <div className="space-y-4">
            <p className="eyebrow">Built for real revenue</p>
            <h2 className="section-title max-w-xl">Education, audience, and client acquisition under one domain.</h2>
            <p className="body-copy max-w-2xl">
              vikeshcodes.in is structured to sell premium content, capture inbound business, and convert social traffic into recurring revenue.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-[var(--muted)]">
            <Link href="/content">Paid Content</Link>
            <Link href="/blogs">Blog</Link>
            <Link href="/portfolio">Portfolio</Link>
            <Link href="/legal/privacy">Privacy Policy</Link>
            <Link href="/legal/terms">Terms</Link>
            <Link href="/legal/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
