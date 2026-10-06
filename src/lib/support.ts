/**
 * Shared between the server action and the client form, so neither has to
 * import the Notion client (which is server-only).
 */
export const SUPPORT_MESSAGE_MAX = 2000;
export const SUPPORT_NAME_MAX = 60;
export const SUPPORT_SUBJECT_MAX = 120;
export const SUPPORT_DEVICE_MAX = 80;
export const SUPPORT_EMAIL_MAX = 254;

export const supportTopics = [
  "Help using the app",
  "Bug report",
  "Feature idea",
  "Privacy or data request",
  "Partnership or press",
  "Something else",
] as const;

export type SupportTopic = (typeof supportTopics)[number];

export type SupportRequest = {
  name: string;
  email: string;
  topic: SupportTopic;
  subject: string;
  device: string;
  message: string;
};

export type SupportFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const initialSupportState: SupportFormState = { status: "idle" };
