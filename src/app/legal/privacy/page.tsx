import type { Metadata } from "next";

import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="container-shell py-16">
      <Reveal className="section-frame max-w-4xl rounded-[2rem] p-8">
        <p className="eyebrow">Legal</p>
        <h1 className="section-title mt-5">Privacy Policy</h1>
        <div className="body-copy mt-6 space-y-4">
          <p>vikeshcodes.in collects account, purchase, analytics, and form-submission data required to deliver content access, process payments, and respond to business inquiries.</p>
          <p>Analytics events are used for funnel measurement, retention reporting, and traffic-source attribution. Payment processing is handled through Razorpay and related provider records are stored for verification and refund handling.</p>
          <p>Users can request account updates or deletion through the contact channels exposed on the platform.</p>
        </div>
      </Reveal>
    </div>
  );
}
