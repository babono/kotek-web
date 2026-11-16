"use client";

import { useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { EnsembleMap } from "@/components/interlock/ensemble-map";
import { KipliSays } from "@/components/kipli/kipli-says";
import { buttonVariants } from "@/components/ui/button";
import { gangsaGuide } from "@/content/landing";

/**
 * The underlined "gangsa" in the hero's description, and the popup it opens:
 * what the instrument is, and where it sits in the orchestra.
 */
export function GangsaGuide({ word }: { word: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  return (
    <>
      {/* Not hidden without JS: it is a word of the sentence first. */}
      <button
        type="button"
        aria-haspopup="dialog"
        title={gangsaGuide.title}
        onClick={() => {
          flushSync(() => setOpened(true));
          dialog.current?.showModal();
        }}
        className="cursor-pointer rounded-sm font-semibold text-ireng underline [text-decoration-skip-ink:none] decoration-kuning decoration-[0.12em] underline-offset-[0.34em] transition-colors hover:decoration-merah focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {word}
      </button>

      {/* Portalled, as the kotekan guide is: a <dialog> can't sit in a <p>. */}
      {opened
        ? createPortal(
            <dialog
              ref={dialog}
              data-lenis-prevent
              aria-labelledby="gangsa-guide-title"
              onClick={(event) => {
                if (event.target === dialog.current) dialog.current?.close();
              }}
              className="pop-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(64rem,calc(100vw-2rem))] overscroll-contain rounded-[1.75rem] bg-surface p-5 text-body backdrop:bg-ireng/70 sm:p-7"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 id="gangsa-guide-title" className="text-[2.25rem] leading-none sm:text-[2.75rem]">
                      {gangsaGuide.title}
                    </h2>
                    <p className="mt-1 max-w-2xl text-[1.0625rem] text-pretty">{gangsaGuide.definition}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dialog.current?.close()}
                    className={`${buttonVariants({ size: "regular" })} cursor-pointer`}
                  >
                    {gangsaGuide.close}
                  </button>
                </div>

                <KipliSays>{gangsaGuide.kipli}</KipliSays>

                <figure className="rounded-[1.375rem] bg-krem px-3 pt-5 pb-3 sm:px-5 sm:pt-6">
                  <div className="mx-auto max-w-[46rem]">
                    <EnsembleMap />
                  </div>
                  <figcaption className="mt-2 text-center text-[0.9375rem] text-muted-foreground">
                    <strong className="font-semibold text-foreground">{gangsaGuide.ensemble}.</strong>{" "}
                    {gangsaGuide.ensembleNote}{" "}
                    <span className="max-sm:block">{gangsaGuide.hint}</span>
                  </figcaption>
                </figure>

              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}

