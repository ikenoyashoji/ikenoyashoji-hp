export function JapanMapHero() {
  const kanagawa = { x: 158, y: 148 };

  const arcs = [
    { id: "sapporo",   from: { x: 162, y: 35  }, cp: { x: 210, y: 85  }, delay: "0s"   },
    { id: "sendai",    from: { x: 174, y: 95  }, cp: { x: 210, y: 118 }, delay: "0.6s" },
    { id: "niigata",   from: { x: 140, y: 115 }, cp: { x: 185, y: 100 }, delay: "1.1s" },
    { id: "nagoya",    from: { x: 132, y: 170 }, cp: { x: 90,  y: 128 }, delay: "1.6s" },
    { id: "osaka",     from: { x: 118, y: 182 }, cp: { x: 65,  y: 145 }, delay: "2.1s" },
    { id: "hiroshima", from: { x: 97,  y: 202 }, cp: { x: 38,  y: 165 }, delay: "2.6s" },
    { id: "fukuoka",   from: { x: 76,  y: 220 }, cp: { x: 18,  y: 182 }, delay: "3.1s" },
    { id: "nagasaki",  from: { x: 65,  y: 235 }, cp: { x: 8,   y: 196 }, delay: "3.6s" },
  ];

  const japanPaths = [
    "M 130 33 L 140 21 L 157 19 L 174 25 L 184 37 L 182 50 L 170 60 L 155 64 L 138 58 L 128 46 Z",
    "M 138 58 C 148 62 162 68 172 76 C 184 87 186 102 180 117 C 174 132 166 140 161 148 C 156 156 152 164 146 174 C 140 183 132 192 122 200 C 112 208 103 214 93 217 C 86 220 80 217 76 222 C 71 226 68 220 66 213 C 70 207 79 203 87 197 C 94 191 97 183 100 173 C 103 163 106 151 109 140 C 112 128 116 115 119 102 C 123 88 127 75 133 65 Z",
    "M 108 212 L 119 207 L 130 208 L 141 213 L 144 221 L 136 228 L 122 230 L 111 224 Z",
    "M 76 222 L 86 217 L 95 219 L 101 230 L 98 242 L 86 249 L 73 245 L 64 234 Z",
  ];

  const combinedPath = japanPaths.join(" ");

  return (
    <svg
      viewBox="-20 0 260 270"
      className="w-full h-full"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="dotGrid" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.5" fill="white" opacity="0.75" />
        </pattern>
        <clipPath id="japanClip">
          <path d={combinedPath} />
        </clipPath>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes arcTrace {
            0%   { stroke-dashoffset: 1; opacity: 0; }
            12%  { opacity: 1; }
            75%  { opacity: 0.9; }
            100% { stroke-dashoffset: 0; opacity: 0; }
          }
          @keyframes pulseOuter {
            0%, 100% { r: 10; opacity: 0.15; }
            50%       { r: 16; opacity: 0.05; }
          }
          @keyframes pulseMid {
            0%, 100% { r: 5; opacity: 0.4; }
            50%       { r: 8; opacity: 0.2; }
          }
          @keyframes blinkDot {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.6; }
          }
          @keyframes originPulse {
            0%, 100% { opacity: 0.6; r: 2.5; }
            50%       { opacity: 1; r: 3.5; }
          }
        `}</style>
      </defs>

      {/* Japan dotted silhouette */}
      <rect
        x="-20" y="0" width="260" height="270"
        fill="url(#dotGrid)"
        clipPath="url(#japanClip)"
      />

      {/* Animated arcs from cities to Kanagawa */}
      {arcs.map((arc) => (
        <path
          key={arc.id}
          d={`M ${arc.from.x} ${arc.from.y} Q ${arc.cp.x} ${arc.cp.y} ${kanagawa.x} ${kanagawa.y}`}
          fill="none"
          stroke="#e8c96b"
          strokeWidth="1.3"
          pathLength="1"
          strokeDasharray="1"
          strokeLinecap="round"
          style={{
            strokeDashoffset: 1,
            animation: `arcTrace 4.5s ease-in-out ${arc.delay} infinite`,
          }}
          filter="url(#glow)"
        />
      ))}

      {/* Origin city dots */}
      {arcs.map((arc) => (
        <circle
          key={`dot-${arc.id}`}
          cx={arc.from.x}
          cy={arc.from.y}
          r="2.5"
          fill="#e8c96b"
          style={{
            animation: `originPulse 3s ease-in-out ${arc.delay} infinite`,
          }}
        />
      ))}

      {/* Kanagawa destination pulse rings */}
      <circle
        cx={kanagawa.x} cy={kanagawa.y} r="10"
        fill="#e8c96b"
        style={{ animation: "pulseOuter 2.5s ease-in-out infinite" }}
      />
      <circle
        cx={kanagawa.x} cy={kanagawa.y} r="5"
        fill="#e8c96b"
        style={{ animation: "pulseMid 2.5s ease-in-out 0.4s infinite" }}
      />
      <circle
        cx={kanagawa.x} cy={kanagawa.y} r="2.5"
        fill="white"
        style={{ animation: "blinkDot 2s ease-in-out infinite" }}
        filter="url(#glow)"
      />

      {/* Kanagawa label */}
      <text
        x={kanagawa.x + 12}
        y={kanagawa.y + 4}
        fontSize="8.5"
        fill="white"
        opacity="0.9"
        fontFamily="sans-serif"
        fontWeight="600"
        style={{ textShadow: "0 0 8px rgba(0,0,0,0.8)" }}
      >
        神奈川
      </text>
    </svg>
  );
}
