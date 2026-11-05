import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the Nawa Sanga tokens in globals.css; Satori can't read CSS variables.
const colors = {
  putih: "#fbf6ee",
  ireng: "#1e2435",
  kuning: "#f5b331",
  highlight: "#ffda8d",
  description: "#6b6e78",
};

const art = (name: string) =>
  readFile(join(process.cwd(), "public/art", name), "base64").then(
    (data) => `data:image/svg+xml;base64,${data}`,
  );

const [katibeh, gate, table, wordmark] = await Promise.all([
  readFile(join(process.cwd(), "src/app/fonts/Katibeh-Regular.ttf")),
  art("pura-gate.svg"),
  art("gangsa-table.svg"),
  art("wordmark-kotek-red.svg"),
]);

/** The hero, in little: inside the gate, the gangsa at the foot. */
export default function Image() {
  const tableWidth = 760;
  const unit = tableWidth / 474;
  const keyWidth = 27.3 * unit;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: colors.putih,
          color: colors.ireng,
          fontFamily: "Katibeh",
        }}
      >
        <img
          src={gate}
          alt=""
          width={302}
          height={630}
          style={{ position: "absolute", top: 0, left: -196, transform: "scaleX(-1)" }}
        />
        <img
          src={gate}
          alt=""
          width={302}
          height={630}
          style={{ position: "absolute", top: 0, right: -196 }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            padding: "64px 150px 0",
          }}
        >
          <img src={wordmark} alt="" width={172} height={40} />
          <div
            style={{
              marginTop: 36,
              fontSize: 112,
              lineHeight: 0.86,
              textAlign: "center",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: (size.width - tableWidth) / 2,
            bottom: 0,
            display: "flex",
            width: tableWidth,
            height: 84 * unit,
          }}
        >
          <img src={table} alt="" width={tableWidth} height={84 * unit} />
          {Array.from({ length: 10 }, (_, key) => (
            <div
              key={key}
              style={{
                position: "absolute",
                left: (82.5 + key * 31.3) * unit,
                top: 35.5 * unit,
                width: keyWidth,
                height: 31 * unit,
                borderRadius: 4,
                backgroundColor: key === 6 ? colors.highlight : colors.kuning,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Katibeh", data: katibeh, weight: 400, style: "normal" }],
    },
  );
}
