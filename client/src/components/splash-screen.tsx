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
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "out" ? "opacity 0.65s ease" : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <img
        src="/logo-mark.png"
        alt="池ノ谷商事"
        style={{
          width: "160px",
          height: "160px",
          objectFit: "contain",
          opacity: phase === "in" ? 0 : 1,
          transform: phase === "in" ? "scale(0.85)" : "scale(1)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      />
    </div>
  );
}
