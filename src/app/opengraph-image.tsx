import { ImageResponse } from "next/og";
import { company } from "@/content/company";

export const alt = `${company.name}: homes built with excellence in Lagos and Abuja`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand share card for every page without its own image.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #3f1112 0%, #5c1a1b 60%, #7a2426 100%)",
          color: "#f8f6f2",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#dbb46b", textTransform: "uppercase" }}>
          Chapelhill Multicompany International
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, lineHeight: 1, letterSpacing: -4, fontWeight: 600 }}>Homes built with excellence.</div>
          <div style={{ marginTop: 20, fontSize: 52, fontStyle: "italic", color: "#dbb46b" }}>Even while you’re abroad.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#e2cfc9" }}>
          <span>Lagos · Abuja · The diaspora</span>
          <span>chapelhill.com.ng</span>
        </div>
      </div>
    ),
    size,
  );
}
