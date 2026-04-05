"use client";

import { useState, useRef, useEffect } from "react";

/* ── 24 hourly labels ─────────────────────────────────────── */
const timeLabels = [
  "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00",
];

/* ── SVG paths — 24 points, x: 0 → 812 (step = 812/23 ≈ 35.3) ── */
const tempPath =
  "M0 210 L35.3 200 L70.6 215 L105.9 195 L141.2 180 L176.5 165 " +
  "L211.8 185 L247.1 170 L282.4 140 L317.7 110 L353 95 L388.3 105 " +
  "L423.6 128 L458.9 145 L494.2 160 L529.5 170 L564.8 155 L600.1 140 " +
  "L635.4 160 L670.7 145 L706 115 L741.3 100 L776.6 80 L812 64";

const humidPath =
  "M0 140 L35.3 135 L70.6 128 L105.9 132 L141.2 140 L176.5 130 " +
  "L211.8 118 L247.1 122 L282.4 130 L317.7 118 L353 112 L388.3 120 " +
  "L423.6 125 L458.9 128 L494.2 120 L529.5 118 L564.8 122 L600.1 116 " +
  "L635.4 128 L670.7 132 L706 120 L741.3 112 L776.6 108 L812 96";

const tempYLabels = ["50°C", "25°C", "0°C"];
const humidYLabels = ["100%", "50%", "0%"];

/* ── Zoom constants ───────────────────────────────────────── */
// Full: all 24 labels fit in the container width
// Zoom: 6 labels visible at a time → inner width = (24/6) × min visible = 4× wider
const ZOOM_TOTAL_W = 800;   // px — minimum chart width in full view (unused in zoom)

/* ── View toggle button ───────────────────────────────────── */
function ViewToggle({
  zoom,
  onChange,
}: {
  zoom: boolean;
  onChange: (z: boolean) => void;
}) {
  return (
    <div
      className="flex items-center rounded-lg overflow-hidden shrink-0"
      style={{ background: "#1A1A1A", border: "1px solid #484847" }}
    >
      {[
        { label: "24H", value: false },
        { label: "6H  ⟷", value: true },
      ].map(({ label, value }) => (
        <button
          key={label}
          onClick={() => onChange(value)}
          className="px-3 py-1 font-jakarta font-bold text-[10px] uppercase tracking-widest transition-all duration-200"
          style={{
            background: zoom === value ? "#FDD34D" : "transparent",
            color: zoom === value ? "#5C4900" : "#ADAAAA",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function TemperatureChart() {
  const [activeTab, setActiveTab] = useState<"temperature" | "humidity">("temperature");
  const [zoom, setZoom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTemp = activeTab === "temperature";
  const chartPath = isTemp ? tempPath : humidPath;
  const yLabels = isTemp ? tempYLabels : humidYLabels;
  const subtitle = isTemp
    ? "Real-Time Thermal Analysis Across 24H"
    : "Real-Time Humidity Analysis Across 24H";

  const [containerW, setContainerW] = useState(0);

  // Measure the actual scroll container width so zoom = exactly 6h visible
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const innerW = zoom
    ? containerW > 0 ? `${containerW * 4}px` : "400%"
    : "100%";

  return (
    <div
      className="flex flex-col gap-6 p-6 md:p-8 rounded-xl w-full"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      {/* ── Header row ─────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: tabs + subtitle */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-6">
            {(["temperature", "humidity"] as const).map((tab) => (
              <button
                key={tab}
                className="font-manrope font-extrabold text-sm uppercase tracking-tight pb-1 transition-all duration-200"
                style={{
                  color: activeTab === tab ? "#FFF" : "#ADAAAA",
                  borderBottom:
                    activeTab === tab ? "2px solid #FDD34D" : "2px solid transparent",
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "temperature" ? "Temperature" : "Humidity"}
              </button>
            ))}
          </div>
          <p
            className="font-jakarta font-bold text-[10px] uppercase tracking-widest"
            style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}
          >
            {subtitle}
          </p>
        </div>

        {/* Right: legend + zoom toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#FDD34D" }} />
            <span className="font-jakarta font-bold text-[10px] uppercase tracking-widest" style={{ color: "#ADAAAA" }}>
              Active Reading
            </span>
          </div>
          <ViewToggle zoom={zoom} onChange={setZoom} />
        </div>
      </div>

      {/* ── Chart area: pinned Y-axis + scrollable chart ───── */}
      <div className="flex gap-0 w-full">

        {/* Pinned Y-axis labels — never scroll, never stretch */}
        <div className="flex flex-col justify-between shrink-0 pb-6" style={{ width: "36px", height: "216px" }}>
          <span className="font-jakarta font-bold text-[10px]" style={{ color: "#ADAAAA" }}>{yLabels[0]}</span>
          <span className="font-jakarta font-bold text-[10px]" style={{ color: "#ADAAAA" }}>{yLabels[1]}</span>
          <span className="font-jakarta font-bold text-[10px]" style={{ color: "#ADAAAA" }}>{yLabels[2]}</span>
        </div>

        {/* Scrollable chart column */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#484847 transparent" }}
        >
          <div style={{ width: innerW }}>
            <svg
              viewBox="0 0 812 276"
              width="100%"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: "200px", display: "block" }}
            >
              <g transform="translate(0, 0)">
                {/* Grid lines */}
                <line x1="0" y1="6"   x2="812" y2="6"   stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="128" x2="812" y2="128" stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="256" x2="812" y2="256" stroke="#484847" strokeWidth="1.03" />

                {/* Vertical hour ticks (zoom only) */}
                {zoom && timeLabels.map((_, i) => (
                  <line
                    key={i}
                    x1={i * (812 / 23)} y1="0"
                    x2={i * (812 / 23)} y2="256"
                    stroke="#1f1f1f"
                    strokeWidth="1"
                  />
                ))}

                {/* Data line */}
                <path
                  key={`${activeTab}-${zoom}`}
                  d={chartPath}
                  stroke="#FDD34D"
                  strokeWidth="3.09"
                  fill="none"
                  style={{
                    strokeDasharray: 2000,
                    strokeDashoffset: 0,
                    animation: "drawLine 0.7s ease-out",
                  }}
                />

                {/* Active reading indicator — placed at last point x=812 */}
                <rect x="804" y={isTemp ? 58 : 90} width="8" height="10" fill="#FDD34D" />
              </g>
            </svg>

            {/* X-axis labels — absolutely positioned to match SVG data-point x-fractions */}
            {/* 24 points span x=0..812 across 23 gaps, so point i is at i/23 * 100% */}
            <div className="relative mt-1" style={{ height: "18px" }}>
              {timeLabels.map((label, i) => (
                <span
                  key={label}
                  className="absolute font-jakarta font-bold uppercase whitespace-nowrap"
                  style={{
                    left: `${(i / 23) * 100}%`,
                    transform: "translateX(-50%)",
                    color: "#ADAAAA",
                    fontSize: zoom ? "11px" : "8px",
                    top: 0,
                  }}
                >
                  {zoom ? label : `${parseInt(label)}h`}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes drawLine {
          from { stroke-dashoffset: 2000; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
