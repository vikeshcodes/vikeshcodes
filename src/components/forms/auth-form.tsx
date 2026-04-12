"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PUBLIC_API_BASE_URL } from "@/lib/api";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  confirmPassword: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/";
  const paramMessage = searchParams.get("message");
  
  const [error, setError] = useState<string | null>(paramMessage);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((values) => {
    setError(null);
    setSuccess(null);

    if (mode === "signup" && values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      const response = await fetch(`/api/auth/${mode === "login" ? "login" : "signup"}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json();
      if (!response.ok) {
        const emailError = payload.email?.[0];
        
        if (mode === "signup" && emailError && emailError.includes("already registered")) {
          window.location.href = `/login?message=${encodeURIComponent("User already exists. Login now")}`;
          return;
        }

        setError(emailError ?? payload.detail ?? payload.non_field_errors?.[0] ?? "Authentication failed.");
        return;
      }

      setSuccess(mode === "login" ? "Signed in successfully." : "Account created! Check your email for the verification code.");
      if (mode === "login") {
        window.location.href = nextPath;
      } else {
        window.location.href = `/verify-email?email=${encodeURIComponent(values.email)}`;
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="section-frame mx-auto w-full max-w-xl rounded-[2rem] p-8">
      <div className="space-y-4">
        <p className="eyebrow">{mode === "login" ? "Welcome back" : "Start monetizing"}</p>
        <h1 className="section-title">{mode === "login" ? "Log into your account." : "Create your learning vault."}</h1>
        <p className="body-copy">
          {mode === "login"
            ? "Access purchased notes, continue your tutorials, and manage your profile."
            : "Join with email and password. Google and GitHub OAuth can be enabled once provider credentials are configured."}
        </p>
      </div>

      <div className="mt-8 grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Email</span>
          <input
            {...register("email")}
            type="email"
            className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none focus:border-[var(--accent)]"
            placeholder="vikesh@example.com"
          />
          {errors.email ? <span className="text-sm text-red-600">{errors.email.message}</span> : null}
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Password</span>
          <input
            {...register("password")}
            type="password"
            className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none focus:border-[var(--accent)]"
            placeholder="Minimum 10 characters"
          />
          {errors.password ? <span className="text-sm text-red-600">{errors.password.message}</span> : null}
        </label>

        {mode === "signup" ? (
          <label className="grid gap-2">
            <span className="text-sm font-semibold">Confirm password</span>
            <input
              {...register("confirmPassword")}
              type="password"
              className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none focus:border-[var(--accent)]"
              placeholder="Repeat your password"
            />
          </label>
        ) : null}
      </div>

      {error ? <p className="mt-5 text-sm text-red-600">{error}</p> : null}
      {success ? <p className="mt-5 text-sm text-[var(--success)]">{success}</p> : null}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button disabled={isPending} className="cta-primary rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60">
          {isPending ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
        </button>
        <a
          href={`${PUBLIC_API_BASE_URL}/accounts/google/login/`}
          className="cta-secondary rounded-full px-5 py-3 text-sm"
        >
          Continue with Google
        </a>
        <a
          href={`${PUBLIC_API_BASE_URL}/accounts/github/login/`}
          className="cta-secondary rounded-full px-5 py-3 text-sm"
        >
          Continue with GitHub
        </a>
      </div>

      <p className="mt-6 text-sm text-[var(--muted)]">
        {mode === "login" ? "Need an account?" : "Already have an account?"}{" "}
        <Link href={mode === "login" ? "/signup" : "/login"} className="font-semibold text-[var(--foreground)]">
          {mode === "login" ? "Sign up" : "Log in"}
        </Link>
      </p>
      {mode === "login" && (
        <p className="mt-3 text-sm text-[var(--muted)]">
          <Link href="/forgot-password" className="font-semibold text-[var(--accent)]">
            Forgot password?
          </Link>
        </p>
      )}
    </form>
  );
}
