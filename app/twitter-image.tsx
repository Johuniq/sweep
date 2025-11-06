import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Sweep - Beautiful Gradient Generator";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: "bold",
              color: "white",
              margin: 0,
              textShadow: "2px 2px 20px rgba(0,0,0,0.3)",
              letterSpacing: "-0.02em",
            }}
          >
            SWEEP
          </h1>
          <p
            style={{
              fontSize: 36,
              color: "rgba(255,255,255,0.95)",
              margin: 0,
              textAlign: "center",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Create stunning gradients in seconds
          </p>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "#FF6B6B",
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "#4ECDC4",
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "#FFE66D",
              }}
            />
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "#A8E6CF",
              }}
            />
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
