import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/constants/site";

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
};

type OgImageOptions = {
  eyebrow: string;
  title: string;
  description: string;
  footer?: string;
};

export function createOgImage({
  eyebrow,
  title,
  description,
  footer = SITE_NAME,
}: OgImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#08080d",
          color: "#f1efe8",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 22% 20%, rgba(91, 33, 182, 0.5), transparent 34%), radial-gradient(circle at 82% 18%, rgba(37, 99, 235, 0.46), transparent 35%), radial-gradient(circle at 20% 82%, rgba(190, 24, 93, 0.22), transparent 34%), radial-gradient(circle at 76% 76%, rgba(14, 165, 233, 0.2), transparent 32%), linear-gradient(135deg, #08080d 0%, #111027 48%, #07070b 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(8, 8, 13, 0.86), rgba(8, 8, 13, 0.2) 46%, rgba(8, 8, 13, 0.78)), linear-gradient(180deg, rgba(8, 8, 13, 0.68), transparent 42%, rgba(8, 8, 13, 0.82))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 84,
            width: 120,
            height: 2,
            background: "rgba(241, 239, 232, 0.5)",
          }}
        />
        <main
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "92px",
          }}
        >
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 880,
            }}
          >
            <p
              style={{
                margin: 0,
                color: "rgba(241, 239, 232, 0.64)",
                fontSize: 28,
                letterSpacing: 0,
              }}
            >
              {eyebrow}
            </p>
            <h1
              style={{
                margin: "28px 0 0",
                color: "#f8f4ea",
                fontSize: title.length > 58 ? 64 : 76,
                fontWeight: 700,
                letterSpacing: 0,
                lineHeight: 1.02,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "32px 0 0",
                maxWidth: 760,
                color: "rgba(241, 239, 232, 0.72)",
                fontSize: 30,
                lineHeight: 1.35,
              }}
            >
              {description}
            </p>
          </section>

          <footer
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "rgba(241, 239, 232, 0.62)",
              fontSize: 25,
            }}
          >
            <span>{footer}</span>
            <span>rashadisayev.com</span>
          </footer>
        </main>
      </div>
    ),
    OG_IMAGE_SIZE,
  );
}
