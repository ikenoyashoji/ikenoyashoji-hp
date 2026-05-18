import { useEffect, useState } from "react";
import logoMark from "@assets/logo-mark-transparent.png";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 1800);
    const t3 = setTimeout(() => onFinish(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.65s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      {/* ロゴマーク */}
      <img
        src={logoMark}
        alt="池ノ谷商事"
        style={{
          width: "120px",
          height: "120px",
          objectFit: "contain",
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.85)" : "scale(1)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      />

      {/* 社名テキスト */}
      <div
        style={{
          marginTop: "20px",
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 900,
          display: "flex",
          alignItems: "flex-end",
          gap: "4px",
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ color: "#9ca3af", fontSize: "10px", letterSpacing: 0, lineHeight: 1 }}>物流企業</span>
          <span style={{ color: "#111827", fontSize: "10px", letterSpacing: 0, lineHeight: 1 }}>株式会社</span>
        </div>
        <span style={{ color: "#0f2044", fontSize: "26px", lineHeight: 1 }}>池ノ谷商事</span>
      </div>

      {/* ローディングライン */}
      <div
        style={{
          marginTop: "24px",
          width: "80px",
          height: "1px",
          background: "#e5e7eb",
          overflow: "hidden",
          opacity: phase === "in" ? 0 : 1,
          transition: "opacity 0.3s ease 0.3s",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(to right, #1a4b99, #1d4ed8)",
            animation: "splashLine 1.2s ease forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes splashLine {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
