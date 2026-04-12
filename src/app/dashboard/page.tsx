import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { getAccessToken, requireViewer } from "@/lib/auth";
import { getLibrary } from "@/lib/api";

export default async function DashboardPage() {
  const viewer = await requireViewer("/dashboard");
  const token = await getAccessToken();
  const library = token
    ? await getLibrary(token).catch(() => ({
        purchases: [],
        subscriptions: [],
        continue_learning: null,
      }))
    : { purchases: [], subscriptions: [], continue_learning: null };

  return (
    <div className="container-shell py-16">
      <Reveal className="section-frame rounded-[2rem] p-8">
        <p className="eyebrow">Member dashboard</p>
        <h1 className="section-title mt-5">Welcome back, {viewer.display_name || viewer.full_name || viewer.email}.</h1>
        <p className="body-copy mt-5">
          Purchased content, active subscriptions, and the next thing to resume all live here.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="section-frame rounded-[2rem] p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Continue learning</p>
          {library.continue_learning ? (
            <div className="mt-4 space-y-4">
              <h2 className="text-2xl font-semibold">{library.continue_learning.title}</h2>
              <p className="body-copy">Jump back into the last active lesson or chapter.</p>
              <Link
                href={`/content/${library.continue_learning.item_slug}`}
                className="cta-primary rounded-full px-5 py-3 text-sm font-semibold"
              >
                Continue
              </Link>
            </div>
          ) : (
            <p className="mt-4 body-copy">Your progress feed will appear once you start a tutorial or course.</p>
          )}

          <div className="mt-10 rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Profile</p>
            <p className="mt-2 text-xl font-semibold">{viewer.email}</p>
            <p className="body-copy mt-2">{viewer.headline || "Update your profile details in the dashboard-enabled account settings."}</p>
          </div>
        </Reveal>

        <Reveal className="section-frame rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Purchased library</p>
              <h2 className="mt-2 text-3xl font-semibold">{library.purchases.length} unlocked assets</h2>
            </div>
            <Link href="/content" className="cta-secondary rounded-full px-5 py-3 text-sm font-semibold">
              Explore more
            </Link>
          </div>

          <div className="mt-8 grid gap-4">
            {library.purchases.length > 0 ? (
              library.purchases.map((purchase) => (
                <Link
                  key={purchase.id}
                  href={`/content/${purchase.item_slug}`}
                  className="rounded-[1.4rem] border border-[var(--line)] bg-white/75 px-5 py-5 transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">{purchase.item_type}</p>
                      <h3 className="mt-2 text-xl font-semibold">{purchase.item_title}</h3>
                    </div>
                    <span className="mono-chip rounded-full px-3 py-1 text-xs">{purchase.status}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="body-copy">No purchases yet. Once orders are captured, items will appear here automatically.</p>
            )}
          </div>

          {library.subscriptions.length > 0 ? (
            <div className="mt-8 rounded-[1.4rem] border border-[var(--line)] bg-white/75 p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--muted)]">Active subscription</p>
              <p className="mt-2 text-xl font-semibold">{library.subscriptions[0].plan_name}</p>
            </div>
          ) : null}
        </Reveal>
      </div>
    </div>
  );
}
