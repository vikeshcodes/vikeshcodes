import type { Metadata } from "next";

import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Join the Team | Vikesh Codes",
  description: "Collaborate with Vikesh Yadav on high-impact products and architecture. Apply to work with us.",
  openGraph: {
    title: "Join the Team | Vikesh Codes",
    description: "Submit a job application to work with Vikesh Yadav on building the future of creator platforms.",
  },
};

export default function WorkWithUsPage() {
  return (
    <div className="container-shell py-16">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal className="section-frame rounded-[2rem] p-8">
          <p className="eyebrow">Team pipeline</p>
          <h1 className="section-title mt-5">Structured applications for collaborators and hires.</h1>
          <p className="body-copy mt-5">
            This route is intended for recruiting support, contract collaborators, and future team growth. It routes directly into the admin-controlled submissions pipeline.
          </p>
          <div className="mt-8 rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">What to include</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--muted)]">
              <li>Role fit and relevant technical depth</li>
              <li>Links to portfolio, GitHub, or shipped projects</li>
              <li>Availability, preferred working model, and communication style</li>
            </ul>
          </div>
        </Reveal>

        <LeadForm
          endpoint="/api/v1/forms/jobs/apply/"
          title="Apply for an open role."
          description="This form is admin-visible and designed for repeatable applicant review."
          submitLabel="Submit application"
          fields={[
            { name: "name", label: "Name", placeholder: "Your name" },
            { name: "email", label: "Email", placeholder: "you@example.com", type: "email" },
            { name: "phone", label: "Phone", placeholder: "Phone number" },
            { name: "role", label: "Role", placeholder: "Frontend engineer, writer, editor, etc." },
            { name: "portfolio_url", label: "Portfolio URL", placeholder: "https://..." },
            { name: "resume_url", label: "Resume URL", placeholder: "https://..." },
            { name: "cover_letter", label: "Cover letter", placeholder: "Why should we talk?", multiline: true },
          ]}
        />
      </div>
    </div>
  );
}
