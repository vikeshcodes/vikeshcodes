"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Viewer } from "@/lib/api";

export function ProfileDropdown({ viewer }: { viewer: Viewer }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const initials = (viewer.display_name || viewer.email || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 p-0.5 shadow-lg ring-2 ring-white transition-all hover:scale-105 hover:ring-[var(--accent)] active:scale-95"
        aria-label="User profile"
      >
        <div className="h-full w-full overflow-hidden rounded-full border border-[var(--line)] bg-white/70 flex items-center justify-center font-bold text-xs">
          {viewer.avatar_url ? (
            <img src={viewer.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-3xl border border-[var(--line)] bg-white/90 p-2 shadow-xl backdrop-blur-xl transition-all">
          <div className="px-4 py-3 border-b border-[var(--line)] mb-2">
            <p className="text-sm font-bold truncate">{viewer.display_name || viewer.full_name || "User"}</p>
            <p className="text-xs text-[var(--muted)] truncate">{viewer.email}</p>
          </div>
          
          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="group flex items-center rounded-2xl px-4 py-2 text-sm transition-colors hover:bg-[var(--line)]"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard#courses"
              onClick={() => setIsOpen(false)}
              className="flex items-center rounded-2xl px-4 py-2 text-sm transition-colors hover:bg-[var(--line)]"
            >
              Purchased Courses
            </Link>
            <Link
              href="/dashboard#notes"
              onClick={() => setIsOpen(false)}
              className="flex items-center rounded-2xl px-4 py-2 text-sm transition-colors hover:bg-[var(--line)]"
            >
              My Notes
            </Link>
            <Link
              href="/dashboard#tutorials"
              onClick={() => setIsOpen(false)}
              className="flex items-center rounded-2xl px-4 py-2 text-sm transition-colors hover:bg-[var(--line)]"
            >
              Tutorials
            </Link>
          </div>

          <div className="mt-2 pt-2 border-t border-[var(--line)]">
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-2xl px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
