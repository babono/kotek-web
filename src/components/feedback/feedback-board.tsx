"use client";

import {
  useEffect,
  useOptimistic,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { submitFeedback } from "@/components/feedback/actions";
import { StickyNote } from "@/components/feedback/sticky-note";
import { buttonVariants } from "@/components/ui/button";
import {
  COOLDOWN_MS,
  initialFeedbackState,
  MESSAGE_MAX,
  NAME_MAX,
  type FeedbackFormState,
  type FeedbackNote,
} from "@/lib/feedback";
import { cn } from "@/lib/utils";

type OptimisticNote = FeedbackNote & { pending?: boolean };

export function FeedbackBoard({
  notes,
  canSubmit,
}: {
  notes: FeedbackNote[];
  canSubmit: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<FeedbackFormState>(initialFeedbackState);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(0);
  const [optimisticNotes, addOptimisticNote] = useOptimistic(
    notes as OptimisticNote[],
    (current, note: OptimisticNote) => [note, ...current],
  );

  // Tick only while a cooldown is actually running.
  useEffect(() => {
    if (cooldownUntil === 0) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [cooldownUntil]);

  const cooldownLeft =
    cooldownUntil === 0 ? 0 : Math.max(0, Math.ceil((cooldownUntil - now) / 1000));

  /*
   * The action is called from onSubmit rather than passed to <form action>.
   * React resets an action-driven form once the action settles — including
   * when it fails — which would throw away the note the visitor just wrote.
   * Driving it here means the fields are cleared only on success.
   */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const trimmed = message.trim();

    startTransition(async () => {
      if (trimmed.length >= 3 && trimmed.length <= MESSAGE_MAX) {
        addOptimisticNote({
          id: `pending-${Date.now()}`,
          name: name.trim() || "Anonymous",
          message: trimmed,
          pending: true,
        });
      }

      const result = await submitFeedback(initialFeedbackState, formData);
      setStatus(result);

      if (result.status === "success") {
        setName("");
        setMessage("");
        setNow(Date.now());
        setCooldownUntil(Date.now() + COOLDOWN_MS);
        // Pull the saved note back so it replaces the optimistic one.
        router.refresh();
      } else if (result.retryAfter) {
        // The server is still counting down (e.g. after a reload).
        setNow(Date.now());
        setCooldownUntil(Date.now() + result.retryAfter * 1000);
      }
    });
  }

  const remaining = MESSAGE_MAX - message.length;
  const isEmpty = message.trim().length === 0;
  const disabled = pending || !canSubmit || isEmpty || cooldownLeft > 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
      <form
        onSubmit={handleSubmit}
        className="flex h-fit flex-col gap-4 rounded-card border border-border bg-card p-6 lg:sticky lg:top-24"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="feedback-name"
            className="text-sm font-medium text-foreground"
          >
            Your name <span className="text-subtle-foreground">(optional)</span>
          </label>
          <input
            id="feedback-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={NAME_MAX}
            autoComplete="name"
            placeholder="Wayan…"
            className="rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-subtle-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="feedback-message"
            className="text-sm font-medium text-foreground"
          >
            Your note
          </label>
          <textarea
            id="feedback-message"
            name="message"
            required
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={MESSAGE_MAX}
            aria-describedby="feedback-count feedback-status"
            placeholder="What would make practice easier for you?…"
            className="resize-none rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-subtle-foreground focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring"
          />
          <p
            id="feedback-count"
            className="text-right text-xs text-subtle-foreground tabular-nums"
          >
            {remaining} characters left
          </p>
        </div>

        {/* Bots fill every field they find; people never see this one. */}
        <div aria-hidden className="hidden">
          <label htmlFor="feedback-website">Leave this empty</label>
          <input id="feedback-website" name="website" type="text" tabIndex={-1} />
        </div>

        <button
          type="submit"
          disabled={disabled}
          className={cn(
            buttonVariants({ variant: "solid" }),
            "w-full disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {pending
            ? "Sticking…"
            : cooldownLeft > 0
              ? `Wait ${cooldownLeft}s…`
              : "Stick it on the board"}
        </button>

        <p
          id="feedback-status"
          aria-live="polite"
          className={cn(
            "min-h-5 text-xs",
            status.status === "error" ? "text-destructive" : "text-success",
          )}
        >
          {canSubmit
            ? (status.message ?? "")
            : "The wall isn’t connected yet — add your Notion keys to enable it."}
        </p>
      </form>

      <div
        // Lenis hijacks the wheel globally; this opts the board out so it
        // scrolls natively once there are more notes than fit.
        data-lenis-prevent
        className="max-h-[34rem] overflow-y-auto overscroll-contain rounded-card border border-border bg-card-strong bg-[radial-gradient(circle_at_1px_1px,rgba(46,33,25,0.14)_1px,transparent_0)] p-5 [background-size:14px_14px] sm:p-7"
      >
        {optimisticNotes.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No notes yet. Be the first to stick one up.
          </p>
        ) : (
          <ul className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {optimisticNotes.map((note, i) => (
              <li key={note.id}>
                <StickyNote
                  name={note.name}
                  message={note.message}
                  index={i}
                  pending={note.pending}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
