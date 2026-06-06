"use client";

import { useRef, useState, useEffect, ClipboardEvent, KeyboardEvent } from "react";
import { cn } from "@/core/utils/cn";
import { OTP_LENGTH } from "../constants";

interface OtpInputProps {
  value:     string;
  onChange:  (value: string) => void;
  hasError?: boolean;
  length?:   number;
  autoFocus?: boolean;
}

export function OtpInput({
  value,
  onChange,
  hasError = false,
  length = OTP_LENGTH,
  autoFocus = false,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = Array<string>(length).fill("");
    for (let i = 0; i < Math.min(value.length, length); i++) {
      arr[i] = value[i] ?? "";
    }
    return arr;
  });
  const [focusIdx, setFocusIdx] = useState(-1);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  // Sync internal digits when external value resets (e.g. resend)
  useEffect(() => {
    if (value === "") setDigits(Array<string>(length).fill(""));
  }, [value, length]);

  function update(idx: number, char: string) {
    if (!/^\d?$/.test(char)) return;
    const next = [...digits];
    next[idx] = char;
    setDigits(next);
    onChange(next.join(""));
    if (char && idx < length - 1) refs.current[idx + 1]?.focus();
  }

  function handleKey(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && idx > 0)          refs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < length - 1)  refs.current[idx + 1]?.focus();
  }

  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    const next = Array<string>(length).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i] ?? "";
    setDigits(next);
    onChange(next.join(""));
    const last = Math.min(text.length, length - 1);
    refs.current[last]?.focus();
  }

  return (
    <div
      className="flex gap-[var(--space-2)] justify-center"
      onPaste={handlePaste}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          value={d}
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onFocus={() => setFocusIdx(i)}
          onBlur={() => setFocusIdx(-1)}
          className={cn(
            "w-12 h-12 text-center p-0 text-xl font-medium outline-none",
            "bg-[var(--input-bg)] text-[var(--input-text)]",
            "rounded-[var(--radius-input)]",
            "border transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
            "caret-[var(--accent-primary)]",
            hasError
              ? "border-[var(--status-error)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--status-error)_22%,transparent)]"
              : focusIdx === i
                ? "border-[var(--accent-primary)] shadow-[0_0_0_3px_var(--border-focus)]"
                : "border-[var(--input-border)]",
          )}
        />
      ))}
    </div>
  );
}
