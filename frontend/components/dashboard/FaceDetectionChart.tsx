"use client";

import { useRef, useState } from "react";

const timeLabels = [
  "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00",
];

// Detections per hour
const data = [
  { family: 0,  unknown: 0  },
  { family: 0,  unknown: 0  },
  { family: 0,  unknown: 1  },
  { family: 1,  unknown: 0  },
  { family: 2,  unknown: 1  },
  { family: 3,  unknown: 2  },
  { family: 5,  unknown: 1  },
  { family: 7,  unknown: 2  },
  { family: 8,  unknown: 4  },
  { family: 6,  unknown: 3  },
  { family: 4,  unknown: 5  },
  { family: 5,  unknown: 3  },
  { family: 9,  unknown: 2  },
  { family: 7,  unknown: 4  },
  { family: 6,  unknown: 6  },
  { family: 4,  unknown: 3  },
  { family: 5,  unknown: 2  },
  { family: 8,  unknown: 1  },
  { family: 7,  unknown: 3  },
  { family: 5,  unknown: 5  },
  { family: 3,  unknown: 2  },
  { family: 2,  unknown: 1  },
  { family: 1,  unknown: 0  },
  { family: 0,  unknown: 0  },
];

const MAX = 10;
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
              <span className="font-jakarta font-bold text-[10px] uppercase tracking-widest" style={{ color: "#ADAAAA" }}>Unknown</span>
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
            {[MAX, MAX / 2, 0].map((val, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 flex items-center gap-2"
                style={{ bottom: `${(val / MAX) * 100}%` }}
              >
                <span
                  className="font-jakarta text-[9px] shrink-0 w-6 text-right"
                  style={{ color: "#484847" }}
                >
                  {val}
                </span>
                <div
                  className="flex-1 border-t"
                  style={{
                    borderColor: val === 0 ? "#484847" : "#2a2a2a",
                    borderStyle: val === 0 ? "solid" : "dashed",
                  }}
                />
              </div>
            ))}

            {/* Grouped bars */}
            <div className="absolute inset-0 pl-7 flex items-end justify-around">
              {data.map((d, i) => (
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
                    title={`${timeLabels[i]} — Unknown: ${d.unknown}`}
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
