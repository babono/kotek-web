"use server";

import { COOLDOWN_MS } from "@/lib/feedback";
import { createSupportRequest } from "@/lib/notion";
import { checkCooldown, recordSubmission, visitorKey } from "@/lib/rate-limit";
import {
  SUPPORT_DEVICE_MAX,
  SUPPORT_EMAIL_MAX,
  SUPPORT_MESSAGE_MAX,
  SUPPORT_NAME_MAX,
  SUPPORT_SUBJECT_MAX,
  supportTopics,
  type SupportFormState,
  type SupportTopic,
} from "@/lib/support";

/** Deliberately loose: the reply is the real check that an address works. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitSupportRequest(
  _prevState: SupportFormState,
  formData: FormData,
): Promise<SupportFormState> {
  // Server Functions are reachable by direct POST, so every rule is enforced
  // here rather than relying on the form's own validation.
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) {
    // A bot filled the hidden field. Look successful, save nothing.
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const topic = String(formData.get("topic") ?? "");
  const subject = String(formData.get("subject") ?? "").trim();
  const device = String(formData.get("device") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!EMAIL_PATTERN.test(email) || email.length > SUPPORT_EMAIL_MAX) {
    return {
      status: "error",
      message: "Please enter a valid email so we can reply.",
    };
  }
  if (!supportTopics.includes(topic as SupportTopic)) {
    return { status: "error", message: "Please choose a topic." };
  }
  if (subject.length < 3 || subject.length > SUPPORT_SUBJECT_MAX) {
    return {
      status: "error",
      message: `Please add a subject (up to ${SUPPORT_SUBJECT_MAX} characters).`,
    };
  }
  if (message.length < 10) {
    return {
      status: "error",
      message: "Please tell us a little more so we can help.",
    };
  }
  if (message.length > SUPPORT_MESSAGE_MAX) {
    return {
      status: "error",
      message: `Messages are limited to ${SUPPORT_MESSAGE_MAX} characters.`,
    };
  }
  if (name.length > SUPPORT_NAME_MAX || device.length > SUPPORT_DEVICE_MAX) {
    return { status: "error", message: "One of the fields is too long." };
  }

  // Keyed apart from the feedback wall, so a note there doesn't block a
  // support request here.
  const visitor = `support:${await visitorKey()}`;
  const cooldown = checkCooldown(visitor, COOLDOWN_MS);
  if (!cooldown.ok) {
    return {
      status: "error",
      message: `Please wait ${cooldown.retryAfter}s before sending another message.`,
    };
  }

  const result = await createSupportRequest({
    name: name || "Anonymous",
    email,
    topic: topic as SupportTopic,
    subject,
    device,
    message,
  });

  if (!result.ok) {
    return { status: "error", message: result.error };
  }

  recordSubmission(visitor);

  return {
    status: "success",
    message: "Thanks, your message is with us. We’ll reply by email.",
  };
}
