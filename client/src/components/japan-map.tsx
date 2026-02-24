const logoImg = "/logo-mark.png";

function MapPin({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y - 6} r="5" fill="#1a4b99" stroke="white" strokeWidth="1.2" />
      <circle cx={x} cy={y - 6} r="2" fill="white" />
      <path d={`M ${x} ${y - 1} L ${x} ${y + 6}`} stroke="#1a4b99" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

export function JapanMapHero() {
  const kanagawa = { x: 158, y: 148 };

  const destinations = [
    { id: "sapporo",   to: { x: 162, y: 35  }, cp: { x: 215, y: 80  }, delay: "0s"   },
    { id: "sendai",    to: { x: 174, y: 95  }, cp: { x: 215, y: 115 }, delay: "0.7s" },
    { id: "niigata",   to: { x: 135, y: 112 }, cp: { x: 190, y: 95  }, delay: "1.3s" },
    { id: "nagoya",    to: { x: 130, y: 172 }, cp: { x: 85,  y: 125 }, delay: "1.9s" },
    { id: "osaka",     to: { x: 116, y: 184 }, cp: { x: 60,  y: 140 }, delay: "2.5s" },
    { id: "hiroshima", to: { x: 95,  y: 202 }, cp: { x: 30,  y: 162 }, delay: "3.1s" },
    { id: "fukuoka",   to: { x: 74,  y: 220 }, cp: { x: 10,  y: 180 }, delay: "3.7s" },
  ];

  const japanPaths = [
    "M 130 33 L 140 21 L 157 19 L 174 25 L 184 37 L 182 50 L 170 60 L 155 64 L 138 58 L 128 46 Z",
    "M 138 58 C 148 62 162 68 172 76 C 184 87 186 102 180 117 C 174 132 166 140 161 148 C 156 156 152 164 146 174 C 140 183 132 192 122 200 C 112 208 103 214 93 217 C 86 220 80 217 76 222 C 71 226 68 220 66 213 C 70 207 79 203 87 197 C 94 191 97 183 100 173 C 103 163 106 151 109 140 C 112 128 116 115 119 102 C 123 88 127 75 133 65 Z",
    "M 108 212 L 119 207 L 130 208 L 141 213 L 144 221 L 136 228 L 122 230 L 111 224 Z",
    "M 76 222 L 86 217 L 95 219 L 101 230 L 98 242 L 86 249 L 73 245 L 64 234 Z",
  ];

  const combinedPath = japanPaths.join(" ");
  const logoSize = 32;

  return (
    <svg
      viewBox="-30 0 270 270"
      className="w-full h-full"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <pattern id="dotGridBlue" width="7" height="7" patternUnits="userSpaceOnUse">
          <circle cx="3.5" cy="3.5" r="1.5" fill="rgba(160,200,240,0.65)" />
        </pattern>
        <clipPath id="japanClipBlue">
          <path d={combinedPath} />
        </clipPath>
        <filter id="lineglow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="circleglow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <style>{`
          @keyframes arcTraceBlue {
            0%   { stroke-dashoffset: 1; opacity: 0; }
            10%  { opacity: 0.95; }
            70%  { opacity: 0.9; }
            100% { stroke-dashoffset: 0; opacity: 0; }
          }
          @keyframes hubPulse {
            0%, 100% { r: 32; opacity: 0.08; }
            50%       { r: 42; opacity: 0.03; }
          }
          @keyframes hubRing {
            0%, 100% { r: 25; opacity: 0.25; }
            50%       { r: 30; opacity: 0.1; }
          }
          @keyframes pinAppear {
            0%   { opacity: 0; transform: translateY(-6px); }
            15%  { opacity: 0; transform: translateY(-6px); }
            30%  { opacity: 1; transform: translateY(0); }
            80%  { opacity: 1; }
            100% { opacity: 0; }
          }
        `}</style>
      </defs>

      {/* Japan dotted silhouette — light blue */}
      <rect
        x="-30" y="0" width="270" height="270"
        fill="url(#dotGridBlue)"
        clipPath="url(#japanClipBlue)"
      />

      {/* Outer hub pulse rings */}
      <circle
        cx={kanagawa.x} cy={kanagawa.y} r="32"
        fill="rgba(100,160,230,0.12)"
        stroke="rgba(100,160,230,0.2)"
        strokeWidth="0.5"
        style={{ animation: "hubPulse 3s ease-in-out infinite" }}
      />
      <circle
        cx={kanagawa.x} cy={kanagawa.y} r="25"
        fill="none"
        stroke="rgba(100,160,230,0.35)"
        strokeWidth="0.8"
        style={{ animation: "hubRing 3s ease-in-out 0.5s infinite" }}
      />

      {/* Animated arcs FROM Kanagawa TO each city */}
      {destinations.map((dest) => (
        <path
          key={dest.id}
          d={`M ${kanagawa.x} ${kanagawa.y} Q ${dest.cp.x} ${dest.cp.y} ${dest.to.x} ${dest.to.y}`}
          fill="none"
          stroke="rgba(180,215,255,0.9)"
          strokeWidth="1.2"
          pathLength="1"
          strokeDasharray="1"
          strokeLinecap="round"
          style={{
            strokeDashoffset: 1,
            animation: `arcTraceBlue 5s ease-in-out ${dest.delay} infinite`,
          }}
          filter="url(#lineglow)"
        />
      ))}

      {/* Map pins at destinations — appear when arc arrives */}
      {destinations.map((dest) => (
        <g
          key={`pin-${dest.id}`}
          style={{
            animation: `pinAppear 5s ease-in-out ${dest.delay} infinite`,
            transformOrigin: `${dest.to.x}px ${dest.to.y}px`,
          }}
        >
          <MapPin x={dest.to.x} y={dest.to.y} />
        </g>
      ))}

      {/* Kanagawa hub: white circle + logo */}
      <circle
        cx={kanagawa.x} cy={kanagawa.y} r="22"
        fill="white"
        stroke="rgba(26,75,153,0.5)"
        strokeWidth="1.5"
        filter="url(#circleglow)"
      />
      <image
        href={logoImg}
        x={kanagawa.x - logoSize / 2}
        y={kanagawa.y - logoSize / 2}
        width={logoSize}
        height={logoSize}
        preserveAspectRatio="xMidYMid meet"
        style={{ borderRadius: "50%" }}
      />

      {/* Kanagawa label */}
      <text
        x={kanagawa.x}
        y={kanagawa.y + 32}
        fontSize="8"
        fill="white"
        opacity="0.9"
        fontFamily="sans-serif"
        fontWeight="700"
        textAnchor="middle"
      >
        神奈川（本社）
      </text>
    </svg>
  );
}
