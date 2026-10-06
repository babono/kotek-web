import "server-only";

import { FEEDBACK_TAG, type FeedbackNote } from "@/lib/feedback";
import type { SupportRequest } from "@/lib/support";

/**
 * Minimal Notion REST client for the feedback wall and the support inbox. Two
 * endpoints are all we need, so this talks to the API directly rather than
 * pulling in the SDK.
 */
const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

/** Property names in the Notion database. Change here if you rename them. */
const PROP = {
  message: "Message",
  name: "Name",
  approved: "Approved",
} as const;

/** Property names in the support database. */
const SUPPORT_PROP = {
  subject: "Subject",
  name: "Name",
  email: "Email",
  topic: "Topic",
  device: "Device",
  message: "Message",
} as const;

function config(databaseId = process.env.NOTION_FEEDBACK_DATABASE_ID) {
  const token = process.env.NOTION_TOKEN;
  if (!token || !databaseId) return null;
  return { token, databaseId };
}

function supportConfig() {
  return config(process.env.NOTION_SUPPORT_DATABASE_ID);
}

export function isNotionConfigured() {
  return config() !== null;
}

export function isSupportConfigured() {
  return supportConfig() !== null;
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

/** Notion returns rich text as an array of runs; join them into one string. */
type RichTextRun = { plain_text?: string };
function plainText(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return (value as RichTextRun[])
    .map((run) => run.plain_text ?? "")
    .join("")
    .trim();
}

export async function getFeedbackNotes(): Promise<FeedbackNote[]> {
  const cfg = config();
  // Not configured yet — render an empty board rather than failing the build.
  if (!cfg) return [];

  const requireApproval = process.env.NOTION_FEEDBACK_REQUIRE_APPROVAL === "true";

  try {
    const res = await fetch(`${NOTION_API}/databases/${cfg.databaseId}/query`, {
      method: "POST",
      headers: headers(cfg.token),
      body: JSON.stringify({
        page_size: 40,
        sorts: [{ timestamp: "created_time", direction: "descending" }],
        ...(requireApproval
          ? {
              filter: {
                property: PROP.approved,
                checkbox: { equals: true },
              },
            }
          : {}),
      }),
      // Notion cannot notify us when a row is edited or deleted, so the
      // board is only ever as fresh as this window (or a manual purge via
      // /api/revalidate-feedback).
      next: { revalidate: 60, tags: [FEEDBACK_TAG] },
    });

    if (!res.ok) {
      console.error("[notion] query failed", res.status, await res.text());
      return [];
    }

    const data = (await res.json()) as {
      results?: { id: string; properties?: Record<string, never> }[];
    };

    return (data.results ?? [])
      .map((page) => {
        const props = (page.properties ?? {}) as Record<
          string,
          { title?: unknown; rich_text?: unknown }
        >;
        return {
          id: page.id,
          message: plainText(props[PROP.message]?.title),
          name: plainText(props[PROP.name]?.rich_text),
        };
      })
      .filter((note) => note.message.length > 0);
  } catch (error) {
    console.error("[notion] query threw", error);
    return [];
  }
}

export async function createFeedbackNote({
  name,
  message,
}: {
  name: string;
  message: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const cfg = config();
  if (!cfg) {
    return { ok: false, error: "The feedback wall isn’t connected yet." };
  }

  try {
    const res = await fetch(`${NOTION_API}/pages`, {
      method: "POST",
      headers: headers(cfg.token),
      body: JSON.stringify({
        parent: { database_id: cfg.databaseId },
        properties: {
          [PROP.message]: { title: [{ text: { content: message } }] },
          [PROP.name]: { rich_text: [{ text: { content: name } }] },
        },
      }),
    });

    if (!res.ok) {
      console.error("[notion] create failed", res.status, await res.text());
      return { ok: false, error: "We couldn’t save that. Please try again." };
    }

    const page = (await res.json()) as { id: string };
    return { ok: true, id: page.id };
  } catch (error) {
    console.error("[notion] create threw", error);
    return { ok: false, error: "We couldn’t save that. Please try again." };
  }
}

/** Notion caps a single rich-text run at 2000 characters. */
function text(content: string) {
  return [{ text: { content: content.slice(0, 2000) } }];
}

export async function createSupportRequest(
  request: SupportRequest,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const cfg = supportConfig();
  if (!cfg) {
    return { ok: false, error: "The support inbox isn’t connected yet." };
  }

  try {
    const res = await fetch(`${NOTION_API}/pages`, {
      method: "POST",
      headers: headers(cfg.token),
      body: JSON.stringify({
        parent: { database_id: cfg.databaseId },
        properties: {
          [SUPPORT_PROP.subject]: { title: text(request.subject) },
          [SUPPORT_PROP.name]: { rich_text: text(request.name) },
          [SUPPORT_PROP.email]: { email: request.email },
          // Notion adds the option on first use, so the database needs no setup.
          [SUPPORT_PROP.topic]: { select: { name: request.topic } },
          [SUPPORT_PROP.device]: { rich_text: text(request.device) },
          [SUPPORT_PROP.message]: { rich_text: text(request.message) },
        },
      }),
    });

    if (!res.ok) {
      console.error("[notion] support create failed", res.status, await res.text());
      return { ok: false, error: "We couldn’t send that. Please try again." };
    }

    return { ok: true };
  } catch (error) {
    console.error("[notion] support create threw", error);
    return { ok: false, error: "We couldn’t send that. Please try again." };
  }
}
