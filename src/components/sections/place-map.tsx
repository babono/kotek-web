"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { placeIcons } from "@/components/icons/place-icons";
import { KipliSays } from "@/components/kipli/kipli-says";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { impact, type PlaceKind } from "@/content/landing";
import { cn } from "@/lib/utils";

const { map, places, farPlace, groups, areas } = impact;

type PinnedPlace = (typeof places)[number];
type Place = PinnedPlace | typeof farPlace;

const ZOOM_ON_PLACE = 2.1;

/** A point's position on the drawing, as fractions of its width and height. */
function onMap({ lat, lng }: { lat: number; lng: number }) {
  const { north, south, west, east } = map.bounds;
  return {
    x: (lng - west) / (east - west),
    y: (north - lat) / (north - south),
  };
}

function viewOf(place: Place | undefined) {
  if (!place) return { ...onMap(map.home), z: 1 };
  if (place.id === farPlace.id) return { ...onMap(map.towardsDenpasar), z: 1 };
  return { ...onMap(place as PinnedPlace), z: ZOOM_ON_PLACE };
}

function pinStyle(point: { lat: number; lng: number }) {
  const { x, y } = onMap(point);
  return { "--x": x, "--y": y } as CSSProperties;
}

/** A pin in the same two-part tactile build as a button: a face on its edge. */
function Pin({
  place,
  selected,
  onSelect,
}: {
  place: PinnedPlace;
  selected: boolean;
  onSelect: (id: string, trigger: HTMLElement) => void;
}) {
  const Icon = placeIcons[place.kind];
  const shape =
    "M22 1.5C10.7 1.5 1.5 10.6 1.5 21.9c0 14.6 16.6 28.6 19.3 30.8.7.6 1.7.6 2.4 0 2.7-2.2 19.3-16.2 19.3-30.8C42.5 10.6 33.3 1.5 22 1.5Z";

  return (
    <div className={cn("place-map-pin", selected ? "z-20" : "z-10")} style={pinStyle(place)}>
      <button
        type="button"
        aria-pressed={selected}
        aria-label={`${place.name}, ${place.where}`}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(place.id, event.currentTarget);
        }}
        className="group absolute bottom-0 left-0 block h-[3.625rem] w-11 origin-bottom -translate-x-1/2 scale-[0.82] cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:scale-100"
      >
        <svg viewBox="0 0 44 58" className="absolute inset-0 size-full overflow-visible" aria-hidden>
          <path
            d={shape}
            transform="translate(0 3)"
            className={selected ? "fill-[var(--kuning-edge)]" : "fill-garis"}
          />
          <path
            d={shape}
            strokeWidth="1.5"
            className={cn(
              "transition-transform duration-75 group-active:translate-y-[3px]",
              selected ? "fill-kuning stroke-[var(--kuning-edge)]" : "fill-surface stroke-garis group-hover:fill-putih",
            )}
          />
        </svg>
        <Icon className="absolute top-2.5 left-1/2 size-6 -translate-x-1/2 text-ireng transition-transform duration-75 group-active:translate-y-[3px]" />
        {selected ? null : (
          <span
            className={cn(
              "pointer-events-none absolute top-3 hidden rounded-full bg-surface/90 px-2.5 py-1 text-[0.8125rem] leading-none font-semibold whitespace-nowrap text-ireng lg:block",
              place.labelSide === "left" ? "right-full mr-1" : "left-full ml-1",
            )}
          >
            {place.name}
          </span>
        )}
      </button>
    </div>
  );
}

/** The picker's selected card: gold ring, gold edge, and the only tumpal here. */
function PlaceCard({ place, onClose }: { place: Place; onClose: () => void }) {
  const kind = groups.find((group) => group.kind === place.kind)?.singular;
  const photo = "photo" in place ? place.photo : undefined;
  const link = "link" in place ? place.link : undefined;

  return (
    <article className="pointer-events-auto relative animate-[reveal-rise_0.5s_cubic-bezier(0.16,1,0.3,1)_backwards] overflow-hidden rounded-card border-[3px] border-kuning bg-surface shadow-[0_5px_0_var(--kuning-edge)]">
      <div aria-hidden className="tumpal" />
      {photo ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1024px) 20rem, 100vw"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : null}
      <div className="flex flex-col items-start gap-2 p-5 pt-4">
        <Eyebrow>{kind}</Eyebrow>
        <h3 className="-mb-2 pr-8 text-[2.5rem] leading-[0.95] text-balance">{place.name}</h3>
        <p className="text-sm font-semibold text-muted-foreground">{place.where}</p>
        <p className="text-[1.0625rem] leading-snug text-pretty">{place.body}</p>
        {link ? (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "secondary", size: "compact" }), "mt-2")}
          >
            {link.label}
          </a>
        ) : null}
      </div>
      <button
        type="button"
        aria-label={impact.close}
        onClick={onClose}
        className={cn(
          buttonVariants({ variant: "secondary", size: "compact" }),
          "absolute top-7 right-3 size-11 cursor-pointer px-0",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </article>
  );
}

/**
 * Six pins on a drawn map of Kuta and Tuban. Choosing one flies there and opens
 * its card; the rail of names does the same, so nothing needs a precise tap.
 * The scroll wheel is left alone: this page has to keep scrolling past it.
 */
export function PlaceMap() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const selected: Place | undefined =
    selectedId === farPlace.id
      ? farPlace
      : places.find((place) => place.id === selectedId);
  const view = viewOf(selected);

  function select(id: string, from: HTMLElement) {
    trigger.current = from;
    setSelectedId((current) => (current === id ? null : id));
  }

  function close() {
    setSelectedId(null);
    // The close button is about to unmount; don't strand keyboard focus.
    trigger.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
        trigger.current?.focus({ preventScroll: true });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId]);

  const railPlaces = (kind: PlaceKind): readonly Place[] =>
    kind === farPlace.kind ? [farPlace] : places.filter((place) => place.kind === kind);

  return (
    <div className="flex flex-col overflow-hidden rounded-[1.75rem] border-[1.5px] border-garis/60 bg-surface">
      <div className="relative">
        {/* Clicking the map itself goes back; the card's button and Esc do too. */}
        <div
          className="place-map aspect-square md:aspect-video"
          data-open={selected ? "true" : "false"}
          style={{ "--cx": view.x, "--cy": view.y, "--z": view.z } as CSSProperties}
          onClick={() => selectedId && setSelectedId(null)}
        >
          <div className="place-map-layer">
            <Image
              src={map.image}
              alt={map.alt}
              width={3026}
              height={2783}
              className="size-full"
            />
          </div>

          {areas.map((area) => (
            <div key={area.name} aria-hidden className="place-map-pin" style={pinStyle(area)}>
              <span
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 text-[0.6875rem] font-semibold tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase",
                  "wideOnly" in area && "hidden lg:block",
                )}
              >
                {area.name}
              </span>
            </div>
          ))}

          {places.map((place) => (
            <Pin
              key={place.id}
              place={place}
              selected={place.id === selectedId}
              onSelect={select}
            />
          ))}

          <button
            type="button"
            aria-pressed={selectedId === farPlace.id}
            aria-label={`${farPlace.name}, ${farPlace.where}, ${farPlace.distance} from here`}
            onClick={(event) => {
              event.stopPropagation();
              select(farPlace.id, event.currentTarget);
            }}
            className={cn(
              buttonVariants({
                variant: selectedId === farPlace.id ? "selected" : "secondary",
                size: "regular",
              }),
              "absolute top-4 right-4 z-20 cursor-pointer gap-1.5 px-4 text-[0.9375rem]",
            )}
          >
            {farPlace.name}
            <span className={selectedId === farPlace.id ? "text-putih/75" : "text-muted-foreground"}>
              {farPlace.distance}
            </span>
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17 17 7M8.5 7H17v8.5" />
            </svg>
          </button>

          {selected ? null : (
            <KipliSays className="pointer-events-none absolute bottom-9 left-3 z-20 lg:bottom-4 lg:left-4">
              {impact.hint}
            </KipliSays>
          )}

          <a
            href={map.credit.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-2 bottom-2 z-20 rounded-full bg-surface/85 px-2 py-0.5 text-[0.6875rem] text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            {map.credit.label}
          </a>
        </div>

        <div
          aria-live="polite"
          className="pointer-events-none z-30 lg:absolute lg:top-4 lg:bottom-4 lg:left-4 lg:w-80"
        >
          {selected ? (
            <div className="p-3 pb-4 lg:p-0">
              <PlaceCard key={selected.id} place={selected} onClose={close} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Phones get one scrolling row above the map, so the card never pushes it away. */}
      <div
        role="group"
        aria-label="Places we tested Kotek"
        className="order-first flex gap-2 overflow-x-auto [scrollbar-width:none] border-b-[1.5px] border-garis/60 p-3 pb-4 lg:order-last lg:gap-x-10 lg:gap-y-4 lg:overflow-visible lg:border-t-[1.5px] lg:border-b-0 lg:px-5 lg:pt-4 lg:pb-5"
      >
        {groups.map((group) => (
          <div key={group.kind} className="contents lg:flex lg:flex-col lg:gap-2">
            <span className="hidden lg:block">
              <Eyebrow>{group.label}</Eyebrow>
            </span>
            <div className="contents lg:flex lg:flex-wrap lg:gap-2">
              {railPlaces(group.kind).map((place) => {
                const Icon = placeIcons[place.kind];
                const isSelected = place.id === selectedId;
                return (
                  <button
                    key={place.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={(event) => select(place.id, event.currentTarget)}
                    className={cn(
                      buttonVariants({
                        variant: isSelected ? "selected" : "secondary",
                        size: "regular",
                      }),
                      "shrink-0 cursor-pointer gap-1.5 px-3.5 text-[0.9375rem]",
                    )}
                  >
                    <Icon className="size-4" />
                    {place.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
