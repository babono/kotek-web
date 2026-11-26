/**
 * The photobooth's pictures, kept in this browser's localStorage and nowhere
 * else. Newest first. A JPEG data URL is a few hundred kilobytes, so the
 * oldest pictures make way when the browser's quota runs out.
 */

export type BoothPhoto = {
  id: string;
  frame: string;
  takenAt: number;
  dataUrl: string;
};

const KEY = "kotek:photobooth:v1";
const EVENT = "kotek:photobooth";

let cache: { raw: string | null; photos: BoothPhoto[] } = { raw: null, photos: [] };
const EMPTY: BoothPhoto[] = [];

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function getPhotos(): BoothPhoto[] {
  const raw = read();
  if (raw !== cache.raw) {
    let photos: BoothPhoto[] = [];
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) photos = parsed as BoothPhoto[];
    } catch {
      photos = [];
    }
    cache = { raw, photos };
  }
  return cache.photos;
}

export function getServerPhotos(): BoothPhoto[] {
  return EMPTY;
}

export function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY || event.key === null) onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function write(photos: BoothPhoto[]) {
  if (photos.length) localStorage.setItem(KEY, JSON.stringify(photos));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Saves a picture, dropping the oldest ones if the browser is full. Returns
 * how many were dropped, or -1 if even the new one alone does not fit.
 */
export function addPhoto(photo: BoothPhoto): number {
  const kept = [photo, ...getPhotos()];
  let dropped = 0;
  while (kept.length) {
    try {
      write(kept);
      return dropped;
    } catch {
      if (kept.length === 1) break;
      kept.pop();
      dropped++;
    }
  }
  return -1;
}

export function removePhoto(id: string) {
  try {
    write(getPhotos().filter((p) => p.id !== id));
  } catch {
    // Removing only ever makes it smaller; nothing to recover.
  }
}

export function clearPhotos() {
  try {
    write([]);
  } catch {
    // As above.
  }
}
