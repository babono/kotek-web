/**
 * Shared between the server action and the client form, so neither has to
 * import the Notion client (which is server-only).
 */
export const MESSAGE_MAX = 240;
export const NAME_MAX = 40;
export const FEEDBACK_TAG = "feedback";

/** Minimum gap between two notes from the same visitor. */
export const COOLDOWN_MS = 30_000;

export type FeedbackNote = {
  id: string;
  name: string;
  message: string;
};

export type FeedbackFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** Seconds the visitor must wait before submitting again. */
  retryAfter?: number;
};

export const initialFeedbackState: FeedbackFormState = { status: "idle" };
