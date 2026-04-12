import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/ui/reveal";
import { RichText } from "@/components/ui/rich-text";
import { getAccessToken } from "@/lib/auth";
import { getPortfolioProject } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const project = await getPortfolioProject(slug);
    return {
      title: project.item.title,
      description: project.item.summary,
    };
  } catch {
    return { title: "Portfolio Project" };
  }
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const token = await getAccessToken();
  const project = await getPortfolioProject(slug, token).catch(() => null);

  if (!project) {
    notFound();
  }

  return (
    <div className="container-shell py-16">
      <Reveal className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="section-frame rounded-[2rem] p-8">
          <p className="eyebrow">{project.industry || "Client work"}</p>
          <h1 className="section-title mt-5">{project.item.title}</h1>
          <p className="body-copy mt-5">{project.item.summary}</p>

          <div className="mt-8 grid gap-4">
            <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[var(--muted)]">Client</p>
              <p className="mt-2 text-xl font-semibold">{project.client_name || "Private engagement"}</p>
            </div>
            <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-4">
              <p className="text-sm text-[var(--muted)]">Services</p>
              <p className="mt-2 text-xl font-semibold">{project.services || "Architecture, build, and delivery"}</p>
            </div>
          </div>
        </div>

        <div className="section-frame rounded-[2rem] p-8">
          {project.case_study_visible ? (
            <RichText html={project.case_study} />
          ) : (
            <div className="space-y-5">
              <p className="eyebrow">Protected case study</p>
              <h2 className="text-3xl font-semibold">
                {token ? "Account permission required." : "Log in to unlock the delivery breakdown."}
              </h2>
              <p className="body-copy">
                {token 
                  ? "Your current session does not have permissions to view this specific deep-dive. Contact Vikesh to request a full walkthrough of this engagement."
                  : "The public page stays open, but the implementation narrative, architecture choices, and execution details stay gated for qualified users."}
              </p>
              <div className="flex flex-wrap gap-4">
                {!token && (
                  <Link href="/login" className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
                    Log in
                  </Link>
                )}
                <Link href="/hire-me" className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
                  {token ? "Request access" : "Start a project"}
                </Link>
              </div>
            </div>
          )}
        </div>
      </Reveal>
    </div>
  );
}
