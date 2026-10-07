import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mirrors the brand tokens in globals.css; Satori can't read CSS variables.
const colors = {
  ebony: "#2e2119",
  ivory: "#e1d9d0",
  primary: "#fddc8a",
  brass: "#b99526",
};

const fontsDir = join(process.cwd(), "src/app/fonts");
const [dreamOrphansBold, figtreeMedium, figtreeSemiBold, logo] = await Promise.all([
  readFile(join(fontsDir, "Dream-Orphans-Bd.otf")),
  readFile(join(fontsDir, "Figtree-Medium.ttf")),
  readFile(join(fontsDir, "Figtree-SemiBold.ttf")),
  readFile(join(process.cwd(), "public/logo-kotek.png"), "base64"),
]);
const logoSrc = `data:image/png;base64,${logo}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          backgroundColor: colors.ebony,
          backgroundImage:
            "radial-gradient(circle at 88% 50%, rgba(185,149,38,0.38), rgba(185,149,38,0) 55%)",
          fontFamily: "Figtree",
          color: colors.ivory,
        }}
      >
        {/* The mark bleeds off the right edge, like the gangsa keys fanning out. */}
        <img
          src={logoSrc}
          alt=""
          width={600}
          height={602}
          style={{
            position: "absolute",
            right: -130,
            top: 14,
            transform: "rotate(-12deg)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            padding: "68px 0 64px 80px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <img src={logoSrc} alt="" width={52} height={52} />
            <span
              style={{
                fontFamily: "Dream Orphans",
                fontSize: 44,
                color: colors.ivory,
              }}
            >
              {siteConfig.name}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                fontFamily: "Dream Orphans",
                fontSize: 74,
                lineHeight: 1.04,
                letterSpacing: "-0.005em",
                color: colors.ivory,
              }}
            >
              Learn{" "}
              <span style={{ color: colors.primary, margin: "0 18px" }}>
                real gamelan
              </span>
              with an interactive practice partner
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: "rgba(225,217,208,0.72)",
                maxWidth: 600,
              }}
            >
              Mount your phone above your gangsa and practice kotekan in real time.
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 26px 14px 22px",
                borderRadius: 999,
                backgroundColor: colors.primary,
                color: colors.ebony,
                fontWeight: 600,
                fontSize: 24,
              }}
            >
              <svg viewBox="0 0 24 24" width={28} height={28} fill={colors.ebony}>
                <path d="M16.36 12.72c-.02-2.36 1.93-3.5 2.02-3.55-1.1-1.61-2.81-1.83-3.42-1.86-1.46-.15-2.85.86-3.59.86-.74 0-1.88-.84-3.09-.82-1.59.02-3.06.92-3.88 2.34-1.65 2.87-.42 7.11 1.19 9.43.79 1.14 1.73 2.41 2.96 2.36 1.19-.05 1.64-.77 3.08-.77 1.44 0 1.84.77 3.09.74 1.28-.02 2.08-1.15 2.86-2.29.9-1.31 1.27-2.58 1.29-2.65-.03-.01-2.48-.95-2.51-3.79ZM14.02 5.6c.65-.79 1.09-1.89.97-2.98-.94.04-2.07.62-2.74 1.41-.6.7-1.13 1.82-.99 2.89 1.05.08 2.11-.53 2.76-1.32Z" />
              </svg>
              Download on the App Store
            </div>
            <span style={{ fontSize: 24, color: "rgba(225,217,208,0.6)" }}>
              {siteConfig.url.replace("https://", "")}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Dream Orphans", data: dreamOrphansBold, weight: 700, style: "normal" },
        { name: "Figtree", data: figtreeMedium, weight: 500, style: "normal" },
        { name: "Figtree", data: figtreeSemiBold, weight: 600, style: "normal" },
      ],
    },
  );
}
