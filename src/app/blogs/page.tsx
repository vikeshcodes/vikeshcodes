import Link from "next/link";
import type { Metadata } from "next";

import { ContentCard } from "@/components/ui/content-card";
import { Reveal } from "@/components/ui/reveal";
import { getBlogs, unwrapCollection } from "@/lib/api";

export const metadata: Metadata = {
  title: "Blogs & Technical Writes | Vikesh Codes",
  description: "Free coding blogs, software architecture guides, and technical insights from Vikesh Yadav.",
  openGraph: {
    title: "Blogs & Technical Writes | Vikesh Codes",
    description: "Deep dives into architecture, Next.js, and product implementation.",
  },
};

export default async function BlogsPage() {
  const payload = await getBlogs().catch(() => []);
  const blogs = unwrapCollection(payload);

  return (
    <div className="container-shell py-16">
      <Reveal className="max-w-3xl space-y-4">
        <p className="eyebrow">Free discovery layer</p>
        <h1 className="section-title">Blogs that rank, educate, and prime visitors for the paid vault.</h1>
        <p className="body-copy">
          Each article is structured to capture search demand and direct the right readers into notes, tutorials, courses, or inbound service requests.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {blogs.length > 0 ? (
          blogs.map((blog) => <ContentCard key={blog.id} item={blog} />)
        ) : (
          <div className="section-frame rounded-[2rem] p-8 text-[var(--muted)] lg:col-span-3">
            No blog posts are published yet. Add blog content from the backend admin.
          </div>
        )}
      </div>

      <div className="mt-12">
        <Link href="/content" className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
          Browse paid content next
        </Link>
      </div>
    </div>
  );
}
