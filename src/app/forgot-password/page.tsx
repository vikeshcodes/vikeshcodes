"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError(null);

    startTransition(async () => {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "password_reset" }),
      });

      // Always continue (avoid email enumeration — backend always returns 200)
      if (res.ok || res.status === 200) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <div className="container-shell py-16">
      <form
        onSubmit={handleSubmit}
        className="section-frame mx-auto w-full max-w-xl rounded-[2rem] p-8"
      >
        {/* Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "var(--accent-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "28px",
          }}
        >
          🔑
        </div>

        <div className="space-y-4" style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Account Recovery
          </p>
          <h1 className="section-title" style={{ marginTop: "8px", marginBottom: "12px" }}>
            Forgot your password?
          </h1>
          <p className="body-copy">
            Enter your email address and we&apos;ll send you a one-time code to
            reset your password.
          </p>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="grid gap-2">
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Email address</span>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vikesh@example.com"
              style={{
                borderRadius: "1rem",
                border: "1px solid var(--line)",
                background: "rgba(255,255,255,0.7)",
                padding: "0.75rem 1rem",
                outline: "none",
                width: "100%",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
            />
          </label>
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "16px" }}>
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-4">
          <button
            id="forgot-password-submit"
            type="submit"
            disabled={isPending || !email}
            className="cta-primary rounded-full"
            style={{
              padding: "0.8rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              opacity: isPending || !email ? 0.55 : 1,
              cursor: isPending || !email ? "not-allowed" : "pointer",
            }}
          >
            {isPending ? "Sending code…" : "Send Reset Code"}
          </button>
        </div>

        <p style={{ marginTop: "20px", textAlign: "center", fontSize: "0.875rem", color: "var(--muted)" }}>
          Remembered it?{" "}
          <Link href="/login" style={{ fontWeight: 600, color: "var(--foreground)" }}>
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
