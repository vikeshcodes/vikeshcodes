import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/ui/reveal";
import { RichText } from "@/components/ui/rich-text";
import { getAccessToken } from "@/lib/auth";
import { formatCurrency, getContentDetail, getSecureContentViewer } from "@/lib/api";

function renderViewer(viewer: Record<string, unknown>) {
  if (viewer.kind === "note") {
    return (
      <div className="space-y-5">
        <div className="rounded-[1.4rem] border border-[var(--line)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent)]">
          {(viewer.watermark as { label?: string; value?: string } | undefined)?.label}:{" "}
          {(viewer.watermark as { value?: string } | undefined)?.value}
        </div>
        <RichText html={String(viewer.content ?? "")} />
      </div>
    );
  }

  if (viewer.kind === "tutorial") {
    const chapters = (viewer.chapters as Array<Record<string, unknown>> | undefined) ?? [];
    return (
      <div className="space-y-8">
        {chapters.map((chapter) => (
          <section key={String(chapter.id)} className="section-frame rounded-[1.6rem] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold">{String(chapter.title)}</h2>
              <span className="mono-chip rounded-full px-3 py-1 text-xs">
                {chapter.is_complete ? "Completed" : `${chapter.completion_percentage ?? 0}% done`}
              </span>
            </div>
            <RichText html={String(chapter.content ?? "")} />
          </section>
        ))}
      </div>
    );
  }

  if (viewer.kind === "course") {
    const sections = (viewer.sections as Array<Record<string, unknown>> | undefined) ?? [];
    return (
      <div className="space-y-8">
        {sections.map((section) => (
          <section key={String(section.id)} className="section-frame rounded-[1.6rem] p-6">
            <h2 className="text-2xl font-semibold">{String(section.title)}</h2>
            <div className="mt-5 grid gap-4">
              {((section.lessons as Array<Record<string, unknown>> | undefined) ?? []).map((lesson) => (
                <div key={String(lesson.id)} className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold">{String(lesson.title)}</h3>
                      <p className="body-copy mt-2">{String(lesson.summary ?? "")}</p>
                    </div>
                    <span className="mono-chip rounded-full px-3 py-1 text-xs">
                      {lesson.is_complete ? "Completed" : `${lesson.watched_seconds ?? 0}s tracked`}
                    </span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-[var(--line)] bg-[#181818] p-3 text-sm text-white/80">
                    <p className="font-medium text-white">Video source</p>
                    <p className="mt-2 break-all">{String(lesson.video_url ?? "")}</p>
                  </div>
                  {lesson.lesson_notes ? (
                    <div className="mt-5">
                      <RichText html={String(lesson.lesson_notes)} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const detail = await getContentDetail(slug);
    return {
      title: detail.title,
      description: detail.summary,
    };
  } catch {
    return { title: "Content" };
  }
}

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const token = await getAccessToken();
  const detail = await getContentDetail(slug, token).catch(() => null);

  if (!detail) {
    notFound();
  }

  const viewer =
    detail.access.has_access && detail.access.viewer_token && token
      ? await getSecureContentViewer(slug, detail.access.viewer_token, token).catch(() => null)
      : null;

  return (
    <div className="container-shell py-16">
      <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-frame rounded-[2rem] p-8">
          <p className="eyebrow">{detail.item_type}</p>
          <h1 className="section-title mt-5">{detail.title}</h1>
          <p className="body-copy mt-5">{detail.summary}</p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[var(--muted)]">Pricing</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(detail.price_inr)}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[var(--muted)]">Access mode</p>
              <p className="mt-2 text-xl font-semibold">
                {detail.access.has_access ? "Unlocked" : "Preview only until purchase"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {detail.access.has_access ? (
              <Link href="/dashboard" className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
                Open dashboard
              </Link>
            ) : token ? (
              <Link href={`/content/${detail.slug}/purchase`} className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
                Buy access
              </Link>
            ) : (
              <Link href="/signup" className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
                Sign up to buy
              </Link>
            )}
            <Link href="/hire-me" className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
              Want this built for your team?
            </Link>
          </div>
        </div>

        <div className="section-frame rounded-[2rem] p-8">
          {viewer ? (
            renderViewer(viewer)
          ) : (
            <>
              <p className="eyebrow">Preview</p>
              {"preview_body" in detail.preview ? (
                <div className="mt-5">
                  <RichText html={String(detail.preview.preview_body ?? "")} />
                </div>
              ) : (
                <pre className="mt-5 overflow-auto whitespace-pre-wrap rounded-[1.4rem] border border-[var(--line)] bg-white/65 p-5 text-sm text-[var(--muted)]">
                  {JSON.stringify(detail.preview, null, 2)}
                </pre>
              )}
            </>
          )}
        </div>
      </Reveal>
    </div>
  );
}
