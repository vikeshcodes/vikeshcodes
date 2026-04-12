"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { OtpInput } from "@/components/ui/otp-input";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resent, setResent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isPending, startTransition] = useTransition();

  // Countdown timer for resend throttle
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = () => {
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, purpose: "email_verify" }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setError(payload.detail ?? "Verification failed. Please try again.");
        return;
      }

      setSuccess("Email verified! Redirecting…");
      setTimeout(() => router.push("/login"), 1500);
    });
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setResent(false);
    setError(null);

    startTransition(async () => {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "email_verify" }),
      });

      if (res.ok) {
        setResent(true);
        setCountdown(60);
      } else {
        setError("Failed to resend. Please try again.");
      }
    });
  };

  const handleCodeChange = useCallback((val: string) => setCode(val), []);

  return (
    <div className="container-shell py-16">
      <div
        className="section-frame mx-auto w-full max-w-xl rounded-[2rem] p-8"
        style={{ textAlign: "center" }}
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
          ✉️
        </div>

        <p className="eyebrow" style={{ justifyContent: "center" }}>Email Verification</p>
        <h1 className="section-title" style={{ marginTop: "8px", marginBottom: "12px" }}>
          Check your inbox
        </h1>
        <p className="body-copy">
          We sent a 6-digit code to{" "}
          <strong style={{ color: "var(--foreground)" }}>{email || "your email"}</strong>.
          It expires in 10 minutes.
        </p>

        {/* Email override (in case user navigated here directly) */}
        {!emailParam && (
          <label className="grid gap-2 mt-6" style={{ textAlign: "left" }}>
            <span className="text-sm font-semibold" style={{ fontSize: "0.875rem", fontWeight: 600 }}>
              Email
            </span>
            <input
              id="verify-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vikesh@example.com"
              style={{
                width: "100%",
                borderRadius: "1rem",
                border: "1px solid var(--line)",
                background: "rgba(255,255,255,0.7)",
                padding: "0.75rem 1rem",
                outline: "none",
              }}
            />
          </label>
        )}

        {/* OTP Input */}
        <div style={{ margin: "32px 0" }}>
          <OtpInput onChange={handleCodeChange} disabled={isPending} />
        </div>

        {error && (
          <p style={{ color: "#dc2626", fontSize: "0.875rem", marginBottom: "16px" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "var(--success)", fontSize: "0.875rem", marginBottom: "16px" }}>
            {success}
          </p>
        )}
        {resent && !error && (
          <p style={{ color: "var(--success)", fontSize: "0.875rem", marginBottom: "16px" }}>
            A new code was sent to your inbox.
          </p>
        )}

        {/* Verify button */}
        <button
          id="verify-otp-btn"
          disabled={isPending || code.length < 6}
          onClick={handleVerify}
          className="cta-primary rounded-full"
          style={{
            width: "100%",
            padding: "0.8rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            opacity: isPending || code.length < 6 ? 0.55 : 1,
            cursor: isPending || code.length < 6 ? "not-allowed" : "pointer",
          }}
        >
          {isPending ? "Verifying…" : "Verify Email"}
        </button>

        {/* Resend */}
        <p style={{ marginTop: "20px", fontSize: "0.875rem", color: "var(--muted)" }}>
          Didn&apos;t receive a code?{" "}
          <button
            id="resend-otp-btn"
            onClick={handleResend}
            disabled={countdown > 0 || isPending}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: countdown > 0 ? "not-allowed" : "pointer",
              fontWeight: 600,
              color: countdown > 0 ? "var(--muted)" : "var(--accent)",
              fontSize: "inherit",
            }}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
          </button>
        </p>

        <p style={{ marginTop: "16px", fontSize: "0.8rem", color: "var(--muted)" }}>
          <Link href="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
