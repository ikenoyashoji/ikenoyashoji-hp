import { useEffect, useState } from "react";

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 600);
    const t2 = setTimeout(() => setPhase("out"), 2000);
    const t3 = setTimeout(() => onFinish(), 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0f2044",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.65s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      {/* ロゴ */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "6px",
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "translateY(12px)" : "translateY(0)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 900,
        }}
      >
        {/* 左列: 物流企業 + 株式会社 */}
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ color: "rgba(126,179,255,0.7)", fontSize: "13px", letterSpacing: 0, lineHeight: 1 }}>
            物流企業
          </span>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "13px", letterSpacing: 0, lineHeight: 1 }}>
            株式会社
          </span>
        </div>
        {/* 右: 池ノ谷商事 */}
        <span style={{ color: "#ffffff", fontSize: "42px", lineHeight: 1 }}>
          池ノ谷商事
        </span>
      </div>

      {/* ローディングライン */}
      <div
        style={{
          marginTop: "28px",
          width: "160px",
          height: "1px",
          background: "rgba(255,255,255,0.15)",
          overflow: "hidden",
          opacity: phase === "in" ? 0 : 1,
          transition: "opacity 0.4s ease 0.3s",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "linear-gradient(to right, #1a4b99, #1d4ed8)",
            animation: "splashLine 1.4s ease forwards",
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
