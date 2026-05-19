import { useEffect, useState } from "react";

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
        gap: "4px",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.65s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <img
        src="/logo-mark.png"
        alt="池ノ谷商事"
        style={{
          width: "300px",
          height: "300px",
          objectFit: "contain",
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.85)" : "scale(1)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      />
      <p
        style={{
          fontFamily: "'Noto Serif JP', serif",
          fontWeight: 700,
          fontSize: "22px",
          color: "#098db7",
          letterSpacing: "0.12em",
          marginTop: "-70px",
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s",
        }}
      >
        Ikenoya Shoji Co.,Ltd.
      </p>
    </div>
  );
}
