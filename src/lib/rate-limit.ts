import "server-only";

/**
 * Per-visitor submit cooldown.
 *
 * Deliberately in-memory: it costs nothing and stops the ordinary case of
 * someone holding down the button. It is not a hard guarantee — serverless
 * instances each keep their own map and lose it on cold start — so treat it
 * as a speed bump rather than real abuse protection.
 */
const lastSeen = new Map<string, number>();

/** Drop entries once they can no longer block anything. */
function prune(now: number, windowMs: number) {
  for (const [key, at] of lastSeen) {
    if (now - at > windowMs) lastSeen.delete(key);
  }
}

export function checkCooldown(
  key: string,
  windowMs: number,
): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();

  // Keep the map from growing without bound on a long-lived server.
  if (lastSeen.size > 5000) prune(now, windowMs);

  const previous = lastSeen.get(key);
  if (previous !== undefined && now - previous < windowMs) {
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - previous)) / 1000) };
  }

  return { ok: true };
}

export function recordSubmission(key: string) {
  lastSeen.set(key, Date.now());
}
