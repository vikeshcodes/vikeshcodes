"use client";

import { useState, useTransition } from "react";

import { PUBLIC_API_BASE_URL } from "@/lib/api";

type Field = {
  name: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  type?: string;
};

export function LeadForm({
  endpoint,
  title,
  description,
  fields,
  submitLabel,
}: {
  endpoint: string;
  title: string;
  description: string;
  fields: Field[];
  submitLabel: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="section-frame rounded-[2rem] p-8"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = Object.fromEntries(formData.entries());

        startTransition(async () => {
          const response = await fetch(`${PUBLIC_API_BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            setMessage("Submission failed. Check the backend configuration and try again.");
            return;
          }

          setMessage("Submitted successfully.");
          (event.target as HTMLFormElement).reset();
        });
      }}
    >
      <div className="space-y-3">
        <p className="eyebrow">Inbound pipeline</p>
        <h2 className="section-title">{title}</h2>
        <p className="body-copy">{description}</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label key={field.name} className={`grid gap-2 ${field.multiline ? "md:col-span-2" : ""}`}>
            <span className="text-sm font-semibold">{field.label}</span>
            {field.multiline ? (
              <textarea
                name={field.name}
                rows={6}
                placeholder={field.placeholder}
                className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none focus:border-[var(--accent)]"
              />
            ) : (
              <input
                name={field.name}
                type={field.type ?? "text"}
                placeholder={field.placeholder}
                className="rounded-2xl border border-[var(--line)] bg-white/70 px-4 py-3 outline-none focus:border-[var(--accent)]"
              />
            )}
          </label>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button disabled={isPending} className="cta-primary rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60">
          {isPending ? "Sending..." : submitLabel}
        </button>
        {message ? <span className="text-sm text-[var(--muted)]">{message}</span> : null}
      </div>
    </form>
  );
}
