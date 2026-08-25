"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import {
  COOLDOWN_MS,
  FEEDBACK_TAG,
  MESSAGE_MAX,
  NAME_MAX,
  type FeedbackFormState,
} from "@/lib/feedback";
import { checkCooldown, recordSubmission } from "@/lib/rate-limit";
import { createFeedbackNote } from "@/lib/notion";

export async function submitFeedback(
  _prevState: FeedbackFormState,
  formData: FormData,
): Promise<FeedbackFormState> {
  // Server Functions are reachable by direct POST, so every rule is enforced
  // here rather than relying on the form's own validation.
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) {
    // A bot filled the hidden field. Look successful, save nothing.
    return { status: "success" };
  }

  const message = String(formData.get("message") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();

  if (message.length < 3) {
    return { status: "error", message: "Please write a little more." };
  }
  if (message.length > MESSAGE_MAX) {
    return {
      status: "error",
      message: `Notes are limited to ${MESSAGE_MAX} characters.`,
    };
  }
  if (name.length > NAME_MAX) {
    return {
      status: "error",
      message: `Names are limited to ${NAME_MAX} characters.`,
    };
  }

  // Enforced here, not just in the UI: the action is reachable by direct POST.
  const visitor = await visitorKey();
  const cooldown = checkCooldown(visitor, COOLDOWN_MS);
  if (!cooldown.ok) {
    return {
      status: "error",
      message: `Please wait ${cooldown.retryAfter}s before posting again.`,
      retryAfter: cooldown.retryAfter,
    };
  }

  const result = await createFeedbackNote({
    name: name || "Anonymous",
    message,
  });

  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  recordSubmission(visitor);

  // Read-your-own-writes: the wall shows the new note straight away.
  updateTag(FEEDBACK_TAG);

  return {
    status: "success",
    message: "Thanks, your note is on the wall.",
    retryAfter: Math.ceil(COOLDOWN_MS / 1000),
  };
}

/** Best-effort visitor identity from the proxy headers. */
async function visitorKey() {
  const requestHeaders = await headers();
  const forwarded = requestHeaders.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}
