import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/ui/reveal";
import { RichText } from "@/components/ui/rich-text";
import { getBlog } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await getBlog(slug);
    const title = blog.meta_title || blog.title;
    const description = blog.meta_description || blog.summary;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: blog.published_at,
        url: `https://vikeshcodes.in/blogs/${slug}`,
        images: [
          {
            url: blog.featured_image || "/og-image.png",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [blog.featured_image || "/og-image.png"],
      },
    };
  } catch {
    return {
      title: "Blog",
    };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug).catch(() => null);

  if (!blog) {
    notFound();
  }

  return (
    <article className="container-shell py-16">
      <Reveal className="mx-auto max-w-4xl">
        <p className="eyebrow">{blog.categories[0]?.name ?? "Blog article"}</p>
        <h1 className="section-title mt-5">{blog.title}</h1>
        <p className="body-copy mt-5 max-w-3xl text-lg">{blog.summary}</p>
      </Reveal>

      <div className="mx-auto mt-10 max-w-4xl">
        <div className="section-frame rounded-[2rem] p-8 md:p-10">
          <RichText html={blog.body} />
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-4xl flex-wrap gap-4">
        <Link href="/content" className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
          Upgrade into paid content
        </Link>
        <Link href="/hire-me" className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
          Hire me for implementation
        </Link>
      </div>
    </article>
  );
}
