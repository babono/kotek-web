"use client";

import { useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { submitSupportRequest } from "@/components/support/actions";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/content/site";
import {
  initialSupportState,
  SUPPORT_DEVICE_MAX,
  SUPPORT_EMAIL_MAX,
  SUPPORT_MESSAGE_MAX,
  SUPPORT_NAME_MAX,
  SUPPORT_SUBJECT_MAX,
  supportTopics,
  type SupportFormState,
} from "@/lib/support";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-subtle-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring";

const labelClass = "text-sm font-medium text-foreground";

function Optional() {
  return <span className="text-subtle-foreground">(optional)</span>;
}

export function SupportForm({ canSubmit }: { canSubmit: boolean }) {
  const [status, setStatus] = useState<SupportFormState>(initialSupportState);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  /*
   * Called from onSubmit rather than passed to <form action>, for the same
   * reason as the feedback wall: an action-driven form resets even when the
   * action fails, which would throw away a long message.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitSupportRequest(initialSupportState, formData);
      setStatus(result);

      if (result.status === "success") {
        form.reset();
        setMessage("");
      }
    });
  }

  const remaining = SUPPORT_MESSAGE_MAX - message.length;
  const disabled = pending || !canSubmit;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-card border border-border bg-card p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="support-name" className={labelClass}>
            Your name <Optional />
          </label>
          <input
            id="support-name"
            name="name"
            type="text"
            maxLength={SUPPORT_NAME_MAX}
            autoComplete="name"
            placeholder="Wayan…"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="support-email" className={labelClass}>
            Email
          </label>
          <input
            id="support-email"
            name="email"
            type="email"
            required
            maxLength={SUPPORT_EMAIL_MAX}
            autoComplete="email"
            spellCheck={false}
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="support-topic" className={labelClass}>
            Topic
          </label>
          <div className="relative">
            <select
              id="support-topic"
              name="topic"
              required
              defaultValue=""
              className={cn(fieldClass, "appearance-none pr-10 invalid:text-subtle-foreground")}
            >
              <option value="" disabled>
                Choose a topic…
              </option>
              {supportTopics.map((topic) => (
                <option key={topic} value={topic} className="text-foreground">
                  {topic}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 16 16"
              className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="support-device" className={labelClass}>
            iPhone &amp; iOS version <Optional />
          </label>
          <input
            id="support-device"
            name="device"
            type="text"
            maxLength={SUPPORT_DEVICE_MAX}
            autoComplete="off"
            placeholder="iPhone 15, iOS 18.2…"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-subject" className={labelClass}>
          Subject
        </label>
        <input
          id="support-subject"
          name="subject"
          type="text"
          required
          minLength={3}
          maxLength={SUPPORT_SUBJECT_MAX}
          autoComplete="off"
          placeholder="The app doesn’t hear my strikes…"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="support-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="support-message"
          name="message"
          required
          minLength={10}
          rows={6}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={SUPPORT_MESSAGE_MAX}
          aria-describedby="support-count support-status"
          placeholder="Tell us what happened and what you expected. Steps to reproduce help a lot…"
          className={cn(fieldClass, "resize-y")}
        />
        <p
          id="support-count"
          className="text-right text-xs text-subtle-foreground tabular-nums"
        >
          {remaining} characters left
        </p>
      </div>

      {/* Bots fill every field they find; people never see this one. */}
      <div aria-hidden className="hidden">
        <label htmlFor="support-website">Leave this empty</label>
        <input id="support-website" name="website" type="text" tabIndex={-1} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle-foreground text-pretty sm:max-w-sm">
          We only use your details to reply to you. See our{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            privacy policy
          </Link>
          .
        </p>
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "primary" }),
            "shrink-0 disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>

      <p
        id="support-status"
        aria-live="polite"
        className={cn(
          "min-h-5 text-sm",
          status.status === "error" ? "text-destructive" : "text-success",
        )}
      >
        {canSubmit
          ? (status.message ?? "")
          : `The form isn’t connected yet. Please email ${siteConfig.email} instead.`}
      </p>
    </form>
  );
}
