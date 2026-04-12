import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { getPortfolio, unwrapCollection } from "@/lib/api";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work and gated case studies from vikeshcodes.in.",
};

export default async function PortfolioPage() {
  const payload = await getPortfolio().catch(() => []);
  const projects = unwrapCollection(payload);

  return (
    <div className="container-shell py-16">
      <Reveal className="max-w-3xl space-y-4">
        <p className="eyebrow">Proof of work</p>
        <h1 className="section-title">Public highlights upfront, deeper case studies behind login.</h1>
        <p className="body-copy">
          Visitors get enough context to trust the work. Logged-in users see process, decision-making, and the implementation details that close serious opportunities.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link key={project.id} href={`/portfolio/${project.item.slug}`} className="surface-card rounded-[1.75rem] p-6">
              <p className="eyebrow">{project.industry || "Case study"}</p>
              <h2 className="mt-4 text-2xl font-semibold">{project.item.title}</h2>
              <p className="body-copy mt-3">{project.item.summary}</p>
              <p className="mt-6 text-sm font-semibold text-[var(--foreground)]">Open case study</p>
            </Link>
          ))
        ) : (
          <div className="section-frame rounded-[2rem] p-8 text-[var(--muted)] lg:col-span-3">
            Add portfolio projects in the admin to showcase delivery work.
          </div>
        )}
      </div>
    </div>
  );
}
