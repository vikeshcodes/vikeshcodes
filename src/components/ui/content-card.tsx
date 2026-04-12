import Link from "next/link";

import { CatalogItemCard, formatCurrency } from "@/lib/api";

export function ContentCard({ item }: { item: CatalogItemCard }) {
  const href = item.item_type === "blog" ? `/blogs/${item.slug}` : `/content/${item.slug}`;
  const isPaid = item.access_model !== "free";

  return (
    <Link href={href} className="surface-card flex h-full flex-col justify-between rounded-[1.75rem] p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
          <span>{item.item_type}</span>
          <span className="mono-chip rounded-full px-3 py-1">{item.estimated_minutes} min</span>
        </div>
        <div className="space-y-3">
          <h3 className="text-2xl font-semibold tracking-tight">{item.title}</h3>
          <p className="body-copy">{item.summary}</p>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
        <div className="flex flex-wrap gap-2">
          {item.categories.slice(0, 2).map((category) => (
            <span key={category.id} className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]">
              {category.name}
            </span>
          ))}
        </div>
        <span className="text-sm font-semibold">
          {isPaid ? formatCurrency(item.price_inr) : "Free"}
        </span>
      </div>
    </Link>
  );
}
