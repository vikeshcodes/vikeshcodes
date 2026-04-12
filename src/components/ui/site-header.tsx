import Link from "next/link";

import type { Viewer } from "@/lib/api";
import { ProfileDropdown } from "./profile-dropdown";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";

const adminAppUrl = process.env.NEXT_PUBLIC_ADMIN_APP_URL ?? "/admin";

const navItems = [
  { href: "/content", label: "Paid Content" },
  { href: "/blogs", label: "Blogs" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/hire-me", label: "Hire Me" },
  { href: "/work-with-us", label: "Work With Us" },
];

export function SiteHeader({ viewer }: { viewer: Viewer | null }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl">
      <div className="container-shell mt-4">
        <div className="section-frame flex items-center justify-between gap-6 rounded-full px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="rounded-full border border-[var(--line)] bg-white/70 dark:bg-black/20 px-3 py-1 text-[0.7rem] font-bold tracking-[0.28em] uppercase">
              VC
            </span>
            <div>
              <p className="text-sm font-semibold">vikeshcodes.in</p>
              <p className="text-xs text-[var(--muted)]">Monetize knowledge. Close clients.</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-[var(--muted)] transition-colors hover:text-[var(--foreground)]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {viewer ? (
              <>
                {viewer.has_admin_access ? (
                  <Link href={adminAppUrl} className="hidden rounded-full border border-[var(--line)] px-4 py-2 text-sm md:inline-flex">
                    Admin
                  </Link>
                ) : null}
                <NotificationBell />
                <ProfileDropdown viewer={viewer} />
              </>
            ) : (
              <>
                <Link href="/login" className="hidden rounded-full border border-[var(--line)] px-4 py-2 text-sm md:inline-flex bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                  Log In
                </Link>
                <Link href="/signup" className="cta-primary rounded-full px-4 py-2 text-sm font-semibold">
                  Start Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
