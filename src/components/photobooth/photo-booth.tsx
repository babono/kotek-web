"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { buttonVariants } from "@/components/ui/button";
import { photoboothCopy as copy } from "@/content/photobooth";
import {
  formatDate,
  frames,
  kipliLines,
  loadArt,
  loadFonts,
  pickLine,
  type Art,
  type Fonts,
  type Frame,
  type Source,
} from "@/lib/photobooth/frames";
import {
  addPhoto,
  clearPhotos,
  getPhotos,
  getServerPhotos,
  removePhoto,
  subscribe,
  type BoothPhoto,
} from "@/lib/photobooth/store";
import { cn } from "@/lib/utils";

/** The preview is drawn smaller than the saved picture, to spare the phone. */
const PREVIEW_SCALE = 0.6;
const COUNT_FROM = 3;
const JPEG_QUALITY = 0.85;

type Camera = "off" | "starting" | "on" | "denied" | "missing";
type Facing = "user" | "environment";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const noSubscribe = () => () => {};

/** Whether this browser can hand a picture to the share sheet. */
function canShareFiles() {
  try {
    const probe = new File([new Blob()], "probe.jpg", { type: "image/jpeg" });
    return typeof navigator.canShare === "function" && navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

function fileName(photo: BoothPhoto) {
  const at = new Date(photo.takenAt);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `kotek-photobooth-${at.getFullYear()}${pad(at.getMonth() + 1)}${pad(at.getDate())}-${pad(at.getHours())}${pad(at.getMinutes())}${pad(at.getSeconds())}.jpg`;
}

function download(photo: BoothPhoto) {
  const a = document.createElement("a");
  a.href = photo.dataUrl;
  a.download = fileName(photo);
  document.body.append(a);
  a.click();
  a.remove();
}

async function send(photo: BoothPhoto) {
  const blob = await (await fetch(photo.dataUrl)).blob();
  const file = new File([blob], fileName(photo), { type: "image/jpeg" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: copy.shareText });
      return;
    } catch (error) {
      // Closing the share sheet is not a failure.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }
  download(photo);
}

export function PhotoBooth() {
  const photos = useSyncExternalStore(subscribe, getPhotos, getServerPhotos);
  const shareable = useSyncExternalStore(noSubscribe, canShareFiles, () => false);

  const [kit, setKit] = useState<{ art: Art; fonts: Fonts; thumbs: Record<string, string> } | null>(null);
  const [frameId, setFrameId] = useState(frames[0].id);
  const frame = frames.find((f) => f.id === frameId) ?? frames[0];

  const [camera, setCamera] = useState<Camera>("off");
  const [facing, setFacing] = useState<Facing>("user");
  const [cameraCount, setCameraCount] = useState(0);
  /** A picture chosen from the device, standing in for the camera. */
  const [picture, setPicture] = useState<ImageBitmap | null>(null);

  const [busy, setBusy] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(0);
  const [taken, setTaken] = useState<Source[]>([]);
  const [line, setLine] = useState(kipliLines[0]);
  const [notice, setNotice] = useState<string | null>(null);
  const [viewing, setViewing] = useState<BoothPhoto | null>(null);

  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const preview = useRef<HTMLCanvasElement>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  const confirm = useRef<HTMLDialogElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const alive = useRef(true);

  // The art and the fonts, then a thumbnail of each frame for the picker.
  useEffect(() => {
    let cancelled = false;
    Promise.all([loadArt(), loadFonts()]).then(([art, fonts]) => {
      if (cancelled) return;
      const thumbs: Record<string, string> = {};
      const date = formatDate(new Date());
      for (const f of frames) {
        const c = document.createElement("canvas");
        const s = 220 / f.height;
        c.width = Math.round(f.width * s);
        c.height = Math.round(f.height * s);
        const ctx = c.getContext("2d")!;
        ctx.scale(s, s);
        f.draw({ ctx, art, fonts, sources: f.slots.map(() => null), line: kipliLines[0], date });
        thumbs[f.id] = c.toDataURL("image/png");
      }
      setKit({ art, fonts, thumbs });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Let the camera go when leaving the page.
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /** What fills the slot being shot: the camera, or the chosen picture. */
  const liveSource = (): Source | null => {
    if (picture) return { image: picture, width: picture.width, height: picture.height };
    const v = video.current;
    if (camera === "on" && v && v.videoWidth) {
      return { image: v, width: v.videoWidth, height: v.videoHeight, mirror: facing === "user" };
    }
    return null;
  };

  // The live preview: the frame redrawn every animation frame.
  useEffect(() => {
    if (!kit) return;
    const canvas = preview.current;
    if (!canvas) return;
    canvas.width = Math.round(frame.width * PREVIEW_SCALE);
    canvas.height = Math.round(frame.height * PREVIEW_SCALE);
    const ctx = canvas.getContext("2d")!;
    const date = formatDate(new Date());
    let raf = 0;
    const draw = () => {
      const live = liveSource();
      const sources = frame.slots.map((_, i) =>
        i < taken.length ? taken[i] : i === taken.length ? live : null,
      );
      ctx.setTransform(PREVIEW_SCALE, 0, 0, PREVIEW_SCALE, 0, 0);
      frame.draw({ ctx, art: kit.art, fonts: kit.fonts, sources, line, date });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
    // liveSource reads refs and these states; listing them keeps it current.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kit, frame, taken, line, camera, facing, picture]);

  async function startCamera(want: Facing = facing) {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("missing");
      return;
    }
    setCamera("starting");
    stream.current?.getTracks().forEach((t) => t.stop());
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: want, width: { ideal: 1920 }, height: { ideal: 1440 } },
        audio: false,
      });
      if (!alive.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = s;
      const v = video.current!;
      v.srcObject = s;
      await v.play().catch(() => undefined);
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameraCount(devices.filter((d) => d.kind === "videoinput").length);
      setFacing(want);
      setPicture(null);
      setCamera("on");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      setCamera(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "missing");
    }
  }

  async function choosePicture(file: File | undefined) {
    if (!file) return;
    try {
      const bitmap = await createImageBitmap(file);
      setPicture(bitmap);
    } catch {
      // Not a picture the browser can read; leave things as they were.
    }
  }

  /** Freezes what the slot shows right now into its own canvas. */
  function snap(): Source | null {
    const live = liveSource();
    if (!live) return null;
    const c = document.createElement("canvas");
    c.width = live.width;
    c.height = live.height;
    const ctx = c.getContext("2d")!;
    if (live.mirror) {
      ctx.translate(c.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(live.image, 0, 0, c.width, c.height);
    return { image: c, width: c.width, height: c.height };
  }

  function render(f: Frame, sources: Source[], lineNow: string) {
    const c = document.createElement("canvas");
    c.width = f.width;
    c.height = f.height;
    const ctx = c.getContext("2d")!;
    f.draw({ ctx, art: kit!.art, fonts: kit!.fonts, sources, line: lineNow, date: formatDate(new Date()) });
    return c.toDataURL("image/jpeg", JPEG_QUALITY);
  }

  function open(photo: BoothPhoto) {
    flushSync(() => setViewing(photo));
    viewer.current?.showModal();
  }

  async function shoot() {
    if (!kit || busy || !liveSource()) return;
    setBusy(true);
    setNotice(null);
    const f = frame;
    const shots: Source[] = [];
    for (let i = 0; i < f.slots.length; i++) {
      for (let n = COUNT_FROM; n > 0; n--) {
        setCount(n);
        await sleep(800);
        if (!alive.current) return;
      }
      setCount(null);
      const shot = snap();
      if (!shot) break;
      shots.push(shot);
      setTaken([...shots]);
      setFlash((x) => x + 1);
      await sleep(f.slots.length > 1 ? 700 : 250);
    }

    if (shots.length === f.slots.length) {
      const photo: BoothPhoto = {
        id: crypto.randomUUID(),
        frame: f.id,
        takenAt: Date.now(),
        dataUrl: render(f, shots, line),
      };
      const dropped = addPhoto(photo);
      if (dropped < 0) setNotice(copy.tooBig);
      else if (dropped > 0) setNotice(copy.full);
      open(photo);
      setLine(pickLine());
    }
    setTaken([]);
    setBusy(false);
  }

  function resetAll() {
    clearPhotos();
    confirm.current?.close();
  }

  const ready = Boolean(kit) && (camera === "on" || picture !== null);
  const saved = viewing ? photos.some((p) => p.id === viewing.id) : false;

  return (
    <div className="flex flex-col gap-14">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* The booth: the live frame, with the countdown over it. */}
        <div className="flex min-h-[24rem] items-center justify-center rounded-[1.75rem] bg-krem p-4 sm:p-6">
          <div className="relative">
            <canvas
              ref={preview}
              aria-label={`Live preview in the ${frame.name} frame`}
              className={cn(
                "block h-auto max-h-[56svh] w-auto sm:max-h-[72svh] max-w-full rounded-xl shadow-[0_6px_0_var(--garis)]",
                !kit && "invisible",
              )}
            />
            <video ref={video} playsInline muted className="hidden" />

            {count !== null ? (
              <span
                key={`count-${count}`}
                aria-live="assertive"
                className="booth-count pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[9rem] leading-none text-surface [text-shadow:0_4px_0_var(--ireng),0_0_40px_rgba(30,36,53,0.5)]"
              >
                {count}
              </span>
            ) : null}
            {flash ? (
              <span key={`flash-${flash}`} className="booth-flash pointer-events-none absolute inset-0 rounded-xl bg-surface" />
            ) : null}

            {kit && !ready ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-ireng/55 p-6 text-center backdrop-blur-[2px]">
                {camera === "denied" || camera === "missing" ? (
                  <p className="max-w-xs text-[0.9375rem] font-semibold text-putih">
                    {camera === "denied" ? copy.cameraDenied : copy.cameraMissing}
                  </p>
                ) : null}
                {camera !== "missing" ? (
                  <button
                    type="button"
                    disabled={camera === "starting"}
                    onClick={() => startCamera()}
                    className={cn(buttonVariants({ size: "regular" }), "cursor-pointer")}
                  >
                    {camera === "starting" ? copy.cameraStarting : copy.cameraOff}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className={cn(buttonVariants({ variant: "secondary", size: "compact" }), "cursor-pointer")}
                >
                  {copy.usePicture}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-[0.9375rem] font-bold text-foreground">{copy.frameHeading}</legend>
            <div className="grid grid-cols-4 gap-2.5 lg:grid-cols-2">
              {frames.map((f) => {
                const on = f.id === frame.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    disabled={busy}
                    onClick={() => setFrameId(f.id)}
                    className={cn(
                      "tactile flex cursor-pointer flex-col items-center gap-2 rounded-card border-[1.5px] p-2 text-center [--depth:3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-default",
                      on
                        ? "border-kuning bg-surface [--base:var(--kuning-edge)]"
                        : "border-garis bg-surface [--base:var(--garis)] hover:bg-putih",
                    )}
                  >
                    <span className="flex h-24 w-full items-center justify-center rounded-lg bg-krem sm:h-28">
                      {kit ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={kit.thumbs[f.id]} alt="" className="h-[88%] w-auto rounded-[4px]" />
                      ) : null}
                    </span>
                    <span className="text-xs leading-tight font-bold text-foreground sm:text-[0.8125rem]">
                      {f.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-sm text-muted-foreground">{frame.blurb}</p>
          </fieldset>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={!ready || busy}
              onClick={shoot}
              className={cn(buttonVariants({ size: "large" }), "w-full cursor-pointer disabled:cursor-default")}
            >
              {busy ? copy.shooting : frame.slots.length > 1 ? copy.shootStrip : copy.shoot}
            </button>
            <div className="flex flex-wrap gap-2">
              {camera === "on" && cameraCount > 1 ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startCamera(facing === "user" ? "environment" : "user")}
                  className={cn(buttonVariants({ variant: "secondary", size: "compact" }), "cursor-pointer")}
                >
                  {copy.switchCamera}
                </button>
              ) : null}
              {ready ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => fileInput.current?.click()}
                  className={cn(buttonVariants({ variant: "secondary", size: "compact" }), "cursor-pointer")}
                >
                  {copy.usePicture}
                </button>
              ) : null}
              {picture && camera !== "on" && camera !== "missing" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => startCamera()}
                  className={cn(buttonVariants({ variant: "secondary", size: "compact" }), "cursor-pointer")}
                >
                  {copy.cameraOff}
                </button>
              ) : null}
              {picture && camera === "on" ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setPicture(null)}
                  className={cn(buttonVariants({ variant: "secondary", size: "compact" }), "cursor-pointer")}
                >
                  Back to camera
                </button>
              ) : null}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                choosePicture(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
            {notice ? (
              <p role="status" className="text-sm font-semibold text-merah-tua">
                {notice}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* The gallery: everything taken in this browser. */}
      <section aria-labelledby="booth-gallery" className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="booth-gallery" className="text-[2.5rem] leading-none sm:text-5xl">
              {copy.galleryHeading}
              {photos.length ? <span className="text-muted-foreground"> · {photos.length}</span> : null}
            </h2>
            <p className="mt-1 text-[0.9375rem] text-muted-foreground">{copy.galleryNote}</p>
          </div>
          {photos.length ? (
            <button
              type="button"
              onClick={() => confirm.current?.showModal()}
              className={cn(buttonVariants({ variant: "secondary", size: "regular" }), "cursor-pointer")}
            >
              {copy.reset}
            </button>
          ) : null}
        </div>

        {photos.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => open(p)}
                  aria-label={`Open the photo from ${new Date(p.takenAt).toLocaleString()}`}
                  className="tactile flex aspect-[4/5] w-full cursor-pointer items-center justify-center overflow-hidden rounded-card border-[1.5px] border-garis bg-krem p-2 [--base:var(--garis)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.dataUrl} alt="" className="max-h-full max-w-full rounded-md object-contain" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card bg-krem px-5 py-8 text-center text-[0.9375rem] text-muted-foreground">
            {copy.galleryEmpty}
          </p>
        )}
      </section>

      {/* One photo, large, with what to do with it. */}
      <dialog
        ref={viewer}
        data-lenis-prevent
        aria-label="Your photo"
        onClose={() => setViewing(null)}
        onClick={(event) => {
          if (event.target === viewer.current) viewer.current?.close();
        }}
        className="pop-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-2rem))] overscroll-contain rounded-[1.75rem] bg-surface p-4 text-body backdrop:bg-ireng/70 sm:p-6"
      >
        {viewing ? (
          <div className="flex flex-col gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={viewing.dataUrl}
              alt="Your photo in its Kotek frame"
              className="mx-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full rounded-xl"
            />
            <div className="flex flex-wrap justify-center gap-2.5">
              {shareable ? (
                <button
                  type="button"
                  onClick={() => send(viewing)}
                  className={cn(buttonVariants({ size: "regular" }), "cursor-pointer")}
                >
                  {copy.send}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => download(viewing)}
                className={cn(
                  buttonVariants({ variant: shareable ? "secondary" : "primary", size: "regular" }),
                  "cursor-pointer",
                )}
              >
                {copy.download}
              </button>
              {saved ? (
                <button
                  type="button"
                  onClick={() => {
                    removePhoto(viewing.id);
                    viewer.current?.close();
                  }}
                  className={cn(buttonVariants({ variant: "secondary", size: "regular" }), "cursor-pointer")}
                >
                  {copy.remove}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => viewer.current?.close()}
                className={cn(buttonVariants({ variant: "secondary", size: "regular" }), "cursor-pointer")}
              >
                {copy.close}
              </button>
            </div>
          </div>
        ) : null}
      </dialog>

      <dialog
        ref={confirm}
        aria-labelledby="booth-reset-title"
        onClick={(event) => {
          if (event.target === confirm.current) confirm.current?.close();
        }}
        className="pop-dialog m-auto w-[min(26rem,calc(100vw-2rem))] rounded-[1.75rem] bg-surface p-6 text-body backdrop:bg-ireng/70"
      >
        <h2 id="booth-reset-title" className="text-[2.25rem] leading-none">
          {copy.resetTitle}
        </h2>
        <p className="mt-2 text-[0.9375rem]">
          {copy.resetBody} ({photos.length} {photos.length === 1 ? "photo" : "photos"})
        </p>
        <div className="mt-5 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => confirm.current?.close()}
            className={cn(buttonVariants({ variant: "secondary", size: "regular" }), "cursor-pointer")}
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className={cn(buttonVariants({ size: "regular" }), "cursor-pointer")}
          >
            {copy.resetConfirm}
          </button>
        </div>
      </dialog>
    </div>
  );
}
