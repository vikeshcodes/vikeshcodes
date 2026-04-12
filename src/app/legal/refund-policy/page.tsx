import type { Metadata } from "next";

import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Refund Policy",
};

export default function RefundPolicyPage() {
  return (
    <div className="container-shell py-16">
      <Reveal className="section-frame max-w-4xl rounded-[2rem] p-8">
        <p className="eyebrow">Legal</p>
        <h1 className="section-title mt-5">Refund Policy</h1>
        <div className="body-copy mt-6 space-y-4">
          <p>Refund requests are reviewed against payment status, access usage, and delivery issues. Digital content purchases are generally non-refundable once substantial access has been consumed unless the item is materially defective.</p>
          <p>Subscription cancellations stop future renewals and continue access through the current paid period unless a separate refund is approved.</p>
          <p>Approved refunds are recorded against payment and order histories inside the admin system.</p>
        </div>
      </Reveal>
    </div>
  );
}
