"use client";

import { useEffect, useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ length = 6, onChange, disabled = false }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    onChange(digits.join(""));
  }, [digits, onChange]);

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (clean && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    const next = [...digits];
    text.split("").forEach((char, i) => {
      next[i] = char;
    });
    setDigits(next);
    const focusIndex = Math.min(text.length, length - 1);
    refs.current[focusIndex]?.focus();
  };

  return (
    <div className="otp-grid" style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          id={`otp-digit-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          style={{
            width: "3.2rem",
            height: "3.8rem",
            textAlign: "center",
            fontSize: "1.6rem",
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            border: `2px solid ${digit ? "var(--accent)" : "var(--line)"}`,
            borderRadius: "0.875rem",
            background: "rgba(255,255,255,0.6)",
            outline: "none",
            transition: "border-color 150ms ease, box-shadow 150ms ease",
            boxShadow: digit ? "0 0 0 3px var(--accent-soft)" : "none",
            caretColor: "var(--accent)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-soft)";
          }}
          onBlur={(e) => {
            if (!digit) {
              e.target.style.borderColor = "var(--line)";
              e.target.style.boxShadow = "none";
            }
          }}
        />
      ))}
    </div>
  );
}
