import type { Metadata } from "next";

import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Terms",
};

export default function TermsPage() {
  return (
    <div className="container-shell py-16">
      <Reveal className="section-frame max-w-4xl rounded-[2rem] p-8">
        <p className="eyebrow">Legal</p>
        <h1 className="section-title mt-5">Terms of Service</h1>
        <div className="body-copy mt-6 space-y-4">
          <p>Access to paid notes, tutorials, and courses is granted on a personal account basis. Resale, redistribution, copying, or extraction of protected content is prohibited.</p>
          <p>Purchased access may be revoked in cases of fraud, unauthorized sharing, chargebacks, or abuse of the platform.</p>
          <p>Client work inquiries and service engagements are governed by separate commercial agreements once a project is accepted.</p>
        </div>
      </Reveal>
    </div>
  );
}
