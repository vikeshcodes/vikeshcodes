import type { Metadata } from "next";

import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/ui/reveal";

const serviceRows = [
  "Full-stack product architecture and platform builds",
  "Conversion-first landing pages and paid content funnels",
  "Django + Next.js implementation for monetized products",
  "Admin systems, analytics, access control, and payment flows",
];

export const metadata: Metadata = {
  title: "Hire Me",
  description: "Book Vikesh for full-stack architecture, implementation, and monetization systems.",
};

export default function HireMePage() {
  return (
    <div className="container-shell py-16">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="section-frame rounded-[2rem] p-8">
          <p className="eyebrow">Service offer</p>
          <h1 className="section-title mt-5">Turn a product idea into a monetized platform.</h1>
          <p className="body-copy mt-5">
            This part of the platform is built to convert visitors into qualified inbound work. It showcases delivery depth, technical clarity, and the specific types of builds that lead to paid projects.
          </p>
          <div className="mt-8 grid gap-3">
            {serviceRows.map((service) => (
              <div key={service} className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 px-4 py-4">
                {service}
              </div>
            ))}
          </div>
        </Reveal>

        <LeadForm
          endpoint="/api/v1/forms/hire/"
          title="Start the conversation."
          description="Use this form to capture consulting leads, product inquiries, and implementation requests."
          submitLabel="Send hire request"
          fields={[
            { name: "name", label: "Name", placeholder: "Your name" },
            { name: "email", label: "Email", placeholder: "you@company.com", type: "email" },
            { name: "company", label: "Company", placeholder: "Company or brand" },
            { name: "budget", label: "Budget", placeholder: "Example: ₹1L - ₹3L" },
            { name: "timeline", label: "Timeline", placeholder: "Example: 4 weeks" },
            { name: "services", label: "Services", placeholder: "Architecture, development, funnel, admin" },
            { name: "message", label: "Project brief", placeholder: "What are you trying to build?", multiline: true },
          ]}
        />
      </div>
    </div>
  );
}
