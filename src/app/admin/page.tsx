import Link from "next/link";
import { redirect } from "next/navigation";

import { Reveal } from "@/components/ui/reveal";
import { getAccessToken, requireViewer } from "@/lib/auth";
import { getAdminOverview } from "@/lib/api";

export default async function AdminPage() {
  const viewer = await requireViewer("/admin");
  if (!viewer.has_admin_access) {
    redirect("/dashboard");
  }

  const token = await getAccessToken();
  const fallbackOverview = {
    commerce: {
      total_users: 0,
      revenue_total: "0",
      paid_orders: 0,
      active_subscriptions: 0,
      recent_orders: [],
    },
    analytics: {
      funnel: { visitors_30d: 0, signups_30d: 0, purchases_30d: 0 },
      retention: { retained_users_30d: 0 },
      traffic_sources: [],
      top_content: [],
    },
  };
  const overview = token ? await getAdminOverview(token).catch(() => fallbackOverview) : fallbackOverview;

  return (
    <div className="container-shell py-16">
      <Reveal className="section-frame rounded-[2rem] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Admin overview</p>
            <h1 className="section-title mt-5">Commerce, analytics, and the operational pulse.</h1>
          </div>
          <a
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"}/admin/`}
            target="_blank"
            rel="noreferrer"
            className="cta-primary rounded-full px-5 py-3 text-sm font-semibold"
          >
            Open Django admin
          </a>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="section-frame rounded-[1.75rem] p-6">
          <p className="text-sm text-[var(--muted)]">Total users</p>
          <p className="mt-3 text-4xl font-semibold">{overview?.commerce.total_users ?? 0}</p>
        </div>
        <div className="section-frame rounded-[1.75rem] p-6">
          <p className="text-sm text-[var(--muted)]">Paid orders</p>
          <p className="mt-3 text-4xl font-semibold">{overview?.commerce.paid_orders ?? 0}</p>
        </div>
        <div className="section-frame rounded-[1.75rem] p-6">
          <p className="text-sm text-[var(--muted)]">Active subscriptions</p>
          <p className="mt-3 text-4xl font-semibold">{overview?.commerce.active_subscriptions ?? 0}</p>
        </div>
        <div className="section-frame rounded-[1.75rem] p-6">
          <p className="text-sm text-[var(--muted)]">Visitors 30d</p>
          <p className="mt-3 text-4xl font-semibold">{overview?.analytics.funnel.visitors_30d ?? 0}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Reveal className="section-frame rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Recent orders</p>
          <div className="mt-6 grid gap-4">
            {overview?.commerce.recent_orders.length ? (
              overview.commerce.recent_orders.map((order) => (
                <div key={order.id} className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{order.line_items[0]?.title_snapshot ?? "Order"}</p>
                    <span className="mono-chip rounded-full px-3 py-1 text-xs">{order.status}</span>
                  </div>
                  <p className="mt-2 text-sm text-[var(--muted)]">{order.total_amount}</p>
                </div>
              ))
            ) : (
              <p className="body-copy">Paid orders will appear here after successful Razorpay captures.</p>
            )}
          </div>
        </Reveal>

        <Reveal className="section-frame rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Top content</p>
          <div className="mt-6 grid gap-4">
            {overview?.analytics.top_content.length ? (
              overview.analytics.top_content.map((item) => (
                <Link
                  key={item.slug}
                  href={`/content/${item.slug}`}
                  className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-4"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {item.item_type} · {item.view_count} views · {item.purchase_count} purchases
                  </p>
                </Link>
              ))
            ) : (
              <p className="body-copy">Content performance metrics will populate after publishing and tracking events.</p>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
