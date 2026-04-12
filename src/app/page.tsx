import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CirclePlay, LockKeyhole, NotebookText, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Turn Content into Cashflow | Vikesh Codes",
  description: "Vikesh Yadav's creator business operating system. Premium coding content, portfolio, and high-conversion funnels for modern developers.",
  openGraph: {
    title: "Turn Content into Cashflow | Vikesh Codes",
    description: "Paid learning products, portfolio built to close inbound work, and audience-ready funnels.",
  },
};

import { ContentCard } from "@/components/ui/content-card";
import { Reveal } from "@/components/ui/reveal";
import { formatCurrency, getHomepageData } from "@/lib/api";

const proofRows = [
  {
    title: "Premium notes and tutorials",
    copy: "Sell structured written content without giving away downloadable assets.",
    icon: NotebookText,
  },
  {
    title: "Video courses with progress tracking",
    copy: "Convert audience trust into recurring revenue with layered course access.",
    icon: CirclePlay,
  },
  {
    title: "Client acquisition funnel",
    copy: "Move high-intent visitors from content to discovery calls and service inquiries.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Secure gated delivery",
    copy: "Short-lived viewer tokens keep paid content inside the platform.",
    icon: LockKeyhole,
  },
];

export default async function Home() {
  const data = await getHomepageData().catch(() => ({
    featured_items: [],
    latest_blogs: [],
    creator: null,
  }));

  return (
    <div className="pb-20">
      <section className="container-shell pt-8">
        <div className="grid min-h-[calc(100svh-7rem)] gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="section-frame relative overflow-hidden rounded-[2.4rem] px-7 py-10 md:px-10 md:py-12">
            <div className="max-w-3xl space-y-8">
              <p className="eyebrow">Creator business operating system</p>
              <div className="space-y-5">
                <h1 className="display-title">Turn content into cashflow, not just traffic.</h1>
                <p className="body-copy max-w-2xl text-lg">
                  vikeshcodes.in combines paid learning products, a portfolio built to close inbound work, and a funnel designed for YouTube and Instagram audiences that are ready to buy.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/content" className="cta-primary rounded-full px-6 py-3 text-sm font-semibold">
                  Explore paid content
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/hire-me" className="cta-secondary rounded-full px-6 py-3 text-sm font-semibold">
                  Hire me
                </Link>
              </div>

              <div className="grid gap-4 pt-8 md:grid-cols-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Flagship note</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {data.featured_items[0] ? formatCurrency(data.featured_items[0].price_inr) : "Premium"}
                  </p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Audience path</p>
                  <p className="mt-2 text-2xl font-semibold">Free blog → login → purchase</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Primary CTA</p>
                  <p className="mt-2 text-2xl font-semibold">Course sale or discovery call</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="hero-visual section-frame relative overflow-hidden rounded-[2.4rem] p-7 md:p-10">
            <div className="hero-orbit left-[-10%] top-[-5%] h-72 w-72" />
            <div className="hero-orbit bottom-[-8%] right-[-12%] h-96 w-96" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                <span>Monetization dashboard</span>
                <span>2026 build</span>
              </div>
              <div className="section-frame rounded-[2rem] bg-white/80 p-5">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="text-sm text-[var(--muted)]">Monthly subscription</p>
                    <p className="mt-1 text-3xl font-semibold">All-access vault</p>
                  </div>
                  <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                    Active funnel
                  </span>
                </div>
                <div className="grid gap-4 pt-5">
                  <div className="flex items-center justify-between rounded-[1.4rem] border border-[var(--line)] bg-white/80 px-4 py-4">
                    <div>
                      <p className="text-sm text-[var(--muted)]">Lead velocity</p>
                      <p className="mt-1 text-xl font-semibold">Content buyers + client leads</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/80 p-4">
                      <p className="text-sm text-[var(--muted)]">Protected notes</p>
                      <p className="mt-2 text-2xl font-semibold">Secure viewer</p>
                    </div>
                    <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/80 p-4">
                      <p className="text-sm text-[var(--muted)]">Course stack</p>
                      <p className="mt-2 text-2xl font-semibold">Progress tracked</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section-frame grid gap-4 rounded-[2rem] p-5 md:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Audience source</p>
                  <p className="mt-2 text-xl font-semibold">YouTube, Instagram, direct</p>
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Admin control</p>
                  <p className="mt-2 text-xl font-semibold">Pricing, offers, analytics, access</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container-shell mt-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {proofRows.map(({ title, copy, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.06} className="surface-card rounded-[1.75rem] p-6">
              <Icon className="h-5 w-5 text-[var(--accent)]" />
              <h2 className="mt-5 text-2xl font-semibold">{title}</h2>
              <p className="body-copy mt-3">{copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-shell mt-20">
        <Reveal className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Revenue products</p>
            <h2 className="section-title">Featured paid content built for conversion.</h2>
          </div>
          <Link href="/content" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)]">
            See the full catalog
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-3">
          {data.featured_items.length > 0 ? (
            data.featured_items.map((item) => <ContentCard key={item.id} item={item} />)
          ) : (
            <div className="section-frame rounded-[2rem] p-8 text-[var(--muted)] lg:col-span-3">
              Add notes, tutorials, or courses from the admin to populate the storefront.
            </div>
          )}
        </div>
      </section>

      <section className="container-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="section-frame rounded-[2rem] p-8">
            <p className="eyebrow">Client conversion</p>
            <h2 className="section-title mt-5">Portfolio credibility that escalates into paid work.</h2>
            <p className="body-copy mt-5">
              The public portfolio explains what is built. Logged-in case studies reveal the process, architecture, and delivery depth that help serious prospects self-qualify.
            </p>
            <div className="mt-8 grid gap-3">
              <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/80 p-4">
                <p className="text-sm text-[var(--muted)]">Public</p>
                <p className="mt-2 text-xl font-semibold">Proof, services, and contact hooks</p>
              </div>
              <div className="rounded-[1.4rem] border border-[var(--line)] bg-white/80 p-4">
                <p className="text-sm text-[var(--muted)]">Logged in</p>
                <p className="mt-2 text-xl font-semibold">Case studies, process, stack decisions</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/portfolio" className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
                Explore portfolio
              </Link>
              <Link href="/hire-me" className="cta-primary rounded-full px-5 py-3 text-sm font-semibold">
                Start a project
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {data.latest_blogs.length > 0 ? (
              data.latest_blogs.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.08}>
                  <ContentCard item={item} />
                </Reveal>
              ))
            ) : (
              <Reveal className="section-frame rounded-[2rem] p-8 md:col-span-2">
                <p className="body-copy">Publish free blogs to feed SEO and warm up traffic before the paywall.</p>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
