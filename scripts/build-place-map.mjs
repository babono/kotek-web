/**
 * Draws public/art/place-map.svg, the map behind the "Where we are" section,
 * from OpenStreetMap roads in the Nawa Sanga palette. The output is committed;
 * run this only to redraw it (a new area, a new road class).
 *
 *   node scripts/build-place-map.mjs              fetches from Overpass
 *   node scripts/build-place-map.mjs cached.json  reuses an Overpass response
 *
 * `bounds` must match `impact.map.bounds` in src/content/landing.ts: that is
 * how the pins land on the drawing.
 *
 * Place names are not drawn here: they sit over the map in the page, so they
 * stay readable at every width. Map data © OpenStreetMap contributors, ODbL;
 * the credit sits on the map.
 */
import { readFileSync, writeFileSync } from "node:fs";

const bounds = { north: -8.715, south: -8.765, west: 115.15, east: 115.205 };

/** One drawing unit is two metres: fine enough, and the numbers stay short. */
const UNIT_METRES = 2;
const METRES_PER_DEGREE = 111_320;
const lonScale = Math.cos((((bounds.north + bounds.south) / 2) * Math.PI) / 180);
const width = Math.round(((bounds.east - bounds.west) * METRES_PER_DEGREE * lonScale) / UNIT_METRES);
const height = Math.round(((bounds.north - bounds.south) * METRES_PER_DEGREE) / UNIT_METRES);

const palette = {
  land: "#fbf6ee", // Putih
  minor: "#efe2cc", // PatternBackground
  major: "#cdbba3", // Garis
  water: "#e3e5e9", // Sangsih, thinned into Putih: the one blue the map needs
  airfield: "#f5ede0", // Krem
};

const minorRoads = new Set(["residential", "living_street", "unclassified", "tertiary_link", "secondary_link"]);
const mediumRoads = new Set(["tertiary", "secondary"]);
const majorRoads = new Set(["trunk", "trunk_link", "primary", "motorway", "motorway_link"]);

const project = ({ lat, lon }) => [
  ((lon - bounds.west) / (bounds.east - bounds.west)) * width,
  ((bounds.north - lat) / (bounds.north - bounds.south)) * height,
];

/** Ramer-Douglas-Peucker, iterative so a long coastline can't overflow the stack. */
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Set([0, points.length - 1]);
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [first, last] = stack.pop();
    const [ax, ay] = points[first];
    const [bx, by] = points[last];
    const length = Math.hypot(bx - ax, by - ay) || 1;
    let worst = -1;
    let worstDistance = tolerance;
    for (let i = first + 1; i < last; i++) {
      const [px, py] = points[i];
      const distance = Math.abs((bx - ax) * (ay - py) - (ax - px) * (by - ay)) / length;
      if (distance > worstDistance) {
        worst = i;
        worstDistance = distance;
      }
    }
    if (worst !== -1) {
      keep.add(worst);
      stack.push([first, worst], [worst, last]);
    }
  }
  return points.filter((_, i) => keep.has(i));
}

const inView = ([x, y], margin = 200) =>
  x > -margin && x < width + margin && y > -margin && y < height + margin;

const toPath = (points, close = false) =>
  points
    .map(([x, y], i) => `${i ? "L" : "M"}${Math.round(x)} ${Math.round(y)}`)
    .join("") + (close ? "Z" : "");

/** A closed way's nodes begin and end on the same point. */
const lineFor = (element, tolerance) => simplify(element.geometry.map(project), tolerance);

/** Joins coastline ways end to end into the fewest continuous chains. */
function stitch(ways) {
  const chains = ways.map((way) => way.geometry.map(project));
  const key = ([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`;
  for (let merged = true; merged; ) {
    merged = false;
    for (let a = 0; a < chains.length && !merged; a++) {
      for (let b = 0; b < chains.length; b++) {
        if (a === b || key(chains[a].at(-1)) !== key(chains[b][0])) continue;
        chains[a].push(...chains[b].slice(1));
        chains.splice(b, 1);
        merged = true;
        break;
      }
    }
  }
  return chains;
}

/**
 * Coastline runs with the land on its left, so the sea is on its right. Each
 * chain leaves the drawing somewhere; close it around the outside on that side.
 */
function seaPolygon(chain) {
  const margin = 1000;
  const corners = [
    [width + margin, -margin],
    [width + margin, height + margin],
    [-margin, height + margin],
    [-margin, -margin],
  ];
  const edgeAngle = ([x, y]) => Math.atan2(y - height / 2, x - width / 2);
  const start = chain[0];
  const end = chain.at(-1);
  const clockwiseFrom = (from, angle) => ((angle - from + Math.PI * 4) % (Math.PI * 2));
  const sweep = clockwiseFrom(edgeAngle(end), edgeAngle(start));
  const around = corners
    .map((corner) => ({ corner, along: clockwiseFrom(edgeAngle(end), edgeAngle(corner)) }))
    .filter(({ along }) => along < sweep)
    .sort((a, b) => a.along - b.along)
    .map(({ corner }) => corner);
  return [...chain, ...around];
}

async function loadOsm() {
  const cached = process.argv[2];
  if (cached) return JSON.parse(readFileSync(cached, "utf8"));
  const box = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  const wide = `${bounds.south - 0.04},${bounds.west - 0.03},${bounds.north + 0.04},${bounds.east + 0.03}`;
  const query = `[out:json][timeout:80];(way["highway"](${box});way["aeroway"~"runway|aerodrome"](${box});way["natural"~"coastline|water"](${wide}););out geom;`;
  const response = await fetch("https://overpass.private.coffee/api/interpreter", {
    method: "POST",
    body: new URLSearchParams({ data: query }),
    headers: { "User-Agent": "kotek-web-map-build/1.0" },
  });
  if (!response.ok) throw new Error(`Overpass answered ${response.status}`);
  return response.json();
}

const { elements } = await loadOsm();
const ways = elements.filter((element) => element.type === "way" && element.geometry);
const tagged = (test) => ways.filter((way) => test(way.tags ?? {}));

const pathsFor = (selection, tolerance) =>
  selection
    .map((way) => lineFor(way, tolerance))
    .filter((line) => line.some((point) => inView(point)))
    .map((line) => toPath(line))
    .join("");

const coast = stitch(tagged((tags) => tags.natural === "coastline"));
const seas = coast
  .filter((chain) => chain.length > 20 && chain[0].join() !== chain.at(-1).join())
  .map((chain) => toPath(seaPolygon(simplify(chain, 2)), true))
  .join("");
const inland = tagged((tags) => tags.natural === "water")
  .map((way) => lineFor(way, 2))
  .filter((line) => line.length > 3 && line.some((point) => inView(point, 0)))
  .map((line) => toPath(line, true))
  .join("");

const airfield = tagged((tags) => tags.aeroway === "aerodrome")
  .map((way) => toPath(lineFor(way, 2), true))
  .join("");
const runways = pathsFor(tagged((tags) => tags.aeroway === "runway"), 2);

const minor = pathsFor(tagged((tags) => minorRoads.has(tags.highway)), 1.5);
const medium = pathsFor(tagged((tags) => mediumRoads.has(tags.highway)), 1.5);
const major = pathsFor(tagged((tags) => majorRoads.has(tags.highway)), 1.5);

const stroke = (d, color, strokeWidth) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
<rect width="${width}" height="${height}" fill="${palette.land}"/>
<path d="${airfield}" fill="${palette.airfield}"/>
<path d="${seas}${inland}" fill="${palette.water}" fill-rule="nonzero"/>
${stroke(runways, palette.major, 24)}
${stroke(minor, palette.minor, 6)}
${stroke(medium, palette.major, 7)}
${stroke(major, palette.major, 12)}
</svg>
`;

writeFileSync(new URL("../public/art/place-map.svg", import.meta.url), svg);
console.log(`place-map.svg: ${width}×${height}, ${(svg.length / 1024).toFixed(0)} KB, ${coast.length} coast chains`);
