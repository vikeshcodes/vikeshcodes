"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";

import { OtpInput } from "@/components/ui/otp-input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }
    if (newPassword.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });

      const payload = await res.json();
      if (!res.ok) {
        setError(payload.detail ?? "Reset failed. Check your code and try again.");
        return;
      }

      setSuccess("Password reset successfully! Redirecting to login…");
      setTimeout(() => router.push("/login"), 2000);
    });
  };

  const handleResend = () => {
    if (countdown > 0 || !email) return;
    setError(null);

    startTransition(async () => {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "password_reset" }),
      });
      if (res.ok) {
        setCountdown(60);
      } else {
        setError("Failed to resend code. Please try again.");
      }
    });
  };

  const handleCodeChange = useCallback((val: string) => setCode(val), []);

  return (
    <div className="container-shell py-16">
      <form
        onSubmit={handleReset}
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
          🔒
        </div>

        <div style={{ textAlign: "center" }}>
          <p className="eyebrow" style={{ justifyContent: "center" }}>
            Password Reset
          </p>
          <h1 className="section-title" style={{ marginTop: "8px", marginBottom: "12px" }}>
            Create a new password
          </h1>
          <p className="body-copy">
            Enter the 6-digit code sent to{" "}
            <strong style={{ color: "var(--foreground)" }}>{email || "your email"}</strong>{" "}
            and choose a new password.
          </p>
        </div>

        <div className="mt-8 grid gap-6">
          {/* OTP */}
          <div>
            <p
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              Enter your reset code
            </p>
            <OtpInput onChange={handleCodeChange} disabled={isPending} />
            <p style={{ textAlign: "center", marginTop: "10px", fontSize: "0.8rem", color: "var(--muted)" }}>
              Didn&apos;t get it?{" "}
              <button
                type="button"
                id="resend-reset-otp-btn"
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
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend"}
              </button>
            </p>
          </div>

          {/* New password */}
          <label className="grid gap-2">
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>New password</span>
            <div style={{ position: "relative" }}>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 10 characters"
                required
                style={{
                  width: "100%",
                  borderRadius: "1rem",
                  border: "1px solid var(--line)",
                  background: "rgba(255,255,255,0.7)",
                  padding: "0.75rem 3rem 0.75rem 1rem",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--line)")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  color: "var(--muted)",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          {/* Confirm password */}
          <label className="grid gap-2">
            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Confirm password</span>
            <input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
              required
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
          <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "16px" }}>{error}</p>
        )}
        {success && (
          <p style={{ color: "var(--success)", fontSize: "0.875rem", marginTop: "16px" }}>{success}</p>
        )}

        <button
          id="reset-password-submit"
          type="submit"
          disabled={isPending || code.length < 6 || !newPassword || !confirmPassword}
          className="cta-primary rounded-full mt-8"
          style={{
            width: "100%",
            padding: "0.8rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            opacity:
              isPending || code.length < 6 || !newPassword || !confirmPassword
                ? 0.55
                : 1,
            cursor:
              isPending || code.length < 6 || !newPassword || !confirmPassword
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isPending ? "Resetting…" : "Reset Password"}
        </button>

        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--muted)",
          }}
        >
          <Link href="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>
            ← Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
}
