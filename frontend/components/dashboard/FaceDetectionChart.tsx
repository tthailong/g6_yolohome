"use client";

import { useRef, useState, useEffect } from "react";
import api from "@/lib/api/client";

const timeLabels = [
  "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00",
];

const ZOOM_TOTAL_W = 3200;

function ViewToggle({ zoom, onChange }: { zoom: boolean; onChange: (z: boolean) => void }) {
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

export default function FaceDetectionChart() {
  const [zoom, setZoom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [chartData, setChartData] = useState<{ family: number; unknown: number }[]>(
    Array.from({ length: 24 }, () => ({ family: 0, unknown: 0 }))
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/devices/camera/stats");
        if (res.data && res.data.length === 24) {
          const mapped = res.data.map((item: any) => ({
            family: item.family,
            unknown: item.unknown
          }));
          setChartData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch camera stats:", err);
      }
    };
    fetchStats();
    
    // Refresh stats every 10 seconds for real-time responsiveness
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const rawMax = Math.max(...chartData.map(d => Math.max(d.family, d.unknown)), 0);
  const MAX = rawMax > 5 ? Math.ceil(rawMax / 5) * 5 : 5;

  const innerW = zoom ? "400%" : "100%";
  // In zoom mode, bar group gets 4× more space → bars are visually bigger
  const barW  = zoom ? 28 : 12; // px per individual bar

  return (
    <div
      className="flex flex-col gap-6 p-6 md:p-8 rounded-xl w-full"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="font-manrope font-extrabold text-sm uppercase tracking-tight text-white">
            Face Detection
          </h3>
          <p
            className="font-jakarta font-bold text-[10px] uppercase tracking-widest"
            style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}
          >
            Visitor Classification Across 24H
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#FDD34D" }} />
              <span className="font-jakarta font-bold text-[10px] uppercase tracking-widest" style={{ color: "#ADAAAA" }}>Family</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#F5D1FB" }} />
              <span className="font-jakarta font-bold text-[10px] uppercase tracking-widest" style={{ color: "#ADAAAA" }}>Stranger</span>
            </div>
          </div>
          <ViewToggle zoom={zoom} onChange={setZoom} />
        </div>
      </div>

      {/* ── Chart ──────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#484847 transparent" }}
      >
        <div style={{ width: innerW }}>
          {/* Bar chart area */}
          <div className="relative" style={{ height: "160px", paddingLeft: "28px" }}>
            {/* Y-axis grid lines + labels */}
            {Array.from({ length: 6 }, (_, i) => {
              const val = (MAX / 5) * (5 - i);
              return (
                <div
                  key={i}
                  className="absolute left-0 right-0 flex items-center gap-2"
                  style={{ bottom: `${((5 - i) / 5) * 140}px` }}
                >
                  <span
                    className="font-jakarta text-[9px] shrink-0 w-6 text-right"
                    style={{ color: "#484847" }}
                  >
                    {Math.round(val * 10) / 10}
                  </span>
                  <div
                    className="flex-1 border-t"
                    style={{
                      borderColor: (5 - i) === 0 ? "#484847" : "#2a2a2a",
                      borderStyle: (5 - i) === 0 ? "solid" : "dashed",
                    }}
                  />
                </div>
              );
            })}

            {/* Grouped bars */}
            <div className="absolute inset-0 pl-7 flex items-end justify-around">
              {chartData.map((d, i) => (
                <div key={i} className="flex items-end gap-[2px] group">
                  {/* Family */}
                  <div
                    className="rounded-t-[2px] transition-all duration-300 hover:brightness-125 cursor-pointer"
                    style={{
                      width: `${barW}px`,
                      height: `${(d.family / MAX) * 140}px`,
                      background: "#FDD34D",
                      minHeight: d.family > 0 ? "2px" : "0px",
                    }}
                    title={`${timeLabels[i]} — Family: ${d.family}`}
                  />
                  {/* Unknown */}
                  <div
                    className="rounded-t-[2px] transition-all duration-300 hover:brightness-125 cursor-pointer"
                    style={{
                      width: `${barW}px`,
                      height: `${(d.unknown / MAX) * 140}px`,
                      background: "#F5D1FB",
                      minHeight: d.unknown > 0 ? "2px" : "0px",
                    }}
                    title={`${timeLabels[i]} — Stranger: ${d.unknown}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-around pl-7 mt-2">
            {timeLabels.map((label, i) => (
              <div key={i} className="flex justify-center" style={{ flex: "1" }}>
                <span
                  className="font-jakarta font-bold uppercase text-center whitespace-nowrap"
                  style={{
                    color: "#ADAAAA",
                    fontSize: zoom ? "11px" : "8px",
                  }}
                >
                  {zoom ? label : `${parseInt(label)}h`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
