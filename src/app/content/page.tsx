import type { Metadata } from "next";

import { ContentCard } from "@/components/ui/content-card";
import { Reveal } from "@/components/ui/reveal";
import { getCatalogItems, unwrapCollection } from "@/lib/api";

export const metadata: Metadata = {
  title: "Premium Coding Content | Vikesh Codes",
  description: "Advanced notes, video tutorials, and structured courses for professional developers.",
  openGraph: {
    title: "Premium Coding Content | Vikesh Codes",
    description: "Monetized learning products built for conversion and deep technical mastery.",
  },
};

export default async function ContentIndexPage() {
  const payload = await getCatalogItems().catch(() => []);
  const items = unwrapCollection(payload);
  const groups = {
    notes: items.filter((item) => item.item_type === "note"),
    tutorials: items.filter((item) => item.item_type === "tutorial"),
    courses: items.filter((item) => item.item_type === "course"),
  };

  return (
    <div className="container-shell py-16">
      <Reveal className="max-w-3xl space-y-4">
        <p className="eyebrow">Paid knowledge products</p>
        <h1 className="section-title">Notes, tutorials, and courses organized to monetize serious learners.</h1>
        <p className="body-copy">
          Structured written assets, chapter-based deep dives, and video programs all run behind access-aware delivery and progress tracking.
        </p>
      </Reveal>

      {[
        { label: "Notes", items: groups.notes },
        { label: "Tutorials", items: groups.tutorials },
        { label: "Courses", items: groups.courses },
      ].map((section) => (
        <section key={section.label} className="mt-14">
          <h2 className="text-3xl font-semibold tracking-tight">{section.label}</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {section.items.length > 0 ? (
              section.items.map((item) => <ContentCard key={item.id} item={item} />)
            ) : (
              <div className="section-frame rounded-[2rem] p-8 text-[var(--muted)] lg:col-span-3">
                No {section.label.toLowerCase()} published yet.
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
