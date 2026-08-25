import { revalidateTag } from "next/cache";
import { FEEDBACK_TAG } from "@/lib/feedback";

/**
 * Purges the cached feedback query so edits made in Notion (deleting a note,
 * ticking Approved) appear straight away rather than after the revalidate
 * window. Guarded by a shared secret because it is a public URL.
 */
export async function GET(request: Request) {
  const secret = process.env.FEEDBACK_REVALIDATE_SECRET;

  if (!secret) {
    return Response.json(
      { ok: false, error: "FEEDBACK_REVALIDATE_SECRET is not set." },
      { status: 501 },
    );
  }

  const provided = new URL(request.url).searchParams.get("secret");
  if (provided !== secret) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  revalidateTag(FEEDBACK_TAG, "max");

  return Response.json({ ok: true, revalidated: FEEDBACK_TAG });
}
