"use client";

import { useState, useRef, useEffect } from "react";
import { dashboardService, AdafruitData } from "@/lib/api/dashboard";

/* ── 24 hourly labels ─────────────────────────────────────── */
const timeLabels = [
  "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00",
];

const tempYLabels = ["50°C", "25°C", "0°C"];
const humidYLabels = ["100%", "50%", "0%"];

/* ── Zoom constants ───────────────────────────────────────── */
const ZOOM_TOTAL_W = 800;   

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

const generatePath = (data: number[], height: number, max: number) => {
  if (data.length === 0) return "";
  const stepX = 812 / (data.length - 1 || 1);
  return data.map((val, i) => {
    const x = i * stepX;
    const y = height - (val / max) * height;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
};

export default function TemperatureChart({ selectedDate }: { selectedDate: Date }) {
  const [activeTab, setActiveTab] = useState<"temperature" | "humidity">("temperature");
  const [zoom, setZoom] = useState(false);
  const [history, setHistory] = useState<AdafruitData[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isTemp = activeTab === "temperature";
  const yLabels = isTemp ? tempYLabels : humidYLabels;
  const subtitle = isTemp
    ? `Thermal Analysis - ${selectedDate.toLocaleDateString()}`
    : `Humidity Analysis - ${selectedDate.toLocaleDateString()}`;

  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        // Use local time for date string to avoid UTC shift
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        // For now using sensor_id 1 for temp, 2 for humid based on install_dht20.sql
        const sensorId = isTemp ? 1 : 2; 
        const data = await dashboardService.getHistory(sensorId, dateStr);
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedDate, activeTab, isTemp]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Process data for the chart (aggregate to 24 slots)
  const chartData = Array(24).fill(0).map((_, hour) => {
    const hourData = history.filter(d => new Date(d.created_at).getHours() === hour);
    if (hourData.length === 0) return 0;
    const avg = hourData.reduce((acc, curr) => acc + parseFloat(curr.value), 0) / hourData.length;
    return avg;
  });

  const chartPath = generatePath(chartData, 256, isTemp ? 50 : 100);

  const innerW = zoom
    ? containerW > 0 ? `${containerW * 4}px` : "400%"
    : "100%";

  return (
    <div
      className="flex flex-col gap-6 p-6 md:p-8 rounded-xl w-full"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: "#FDD34D" }} />
            <span className="font-jakarta font-bold text-[10px] uppercase tracking-widest" style={{ color: "#ADAAAA" }}>
              {loading ? "Loading..." : "Live Reading"}
            </span>
          </div>
          <ViewToggle zoom={zoom} onChange={setZoom} />
        </div>
      </div>

      <div className="flex gap-0 w-full">
        <div className="flex flex-col justify-between shrink-0 pb-6" style={{ width: "36px", height: "216px" }}>
          <span className="font-jakarta font-bold text-[10px]" style={{ color: "#ADAAAA" }}>{yLabels[0]}</span>
          <span className="font-jakarta font-bold text-[10px]" style={{ color: "#ADAAAA" }}>{yLabels[1]}</span>
          <span className="font-jakarta font-bold text-[10px]" style={{ color: "#ADAAAA" }}>{yLabels[2]}</span>
        </div>

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
              <g transform="translate(0, 10)">
                <line x1="0" y1="6"   x2="812" y2="6"   stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="128" x2="812" y2="128" stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="256" x2="812" y2="256" stroke="#484847" strokeWidth="1.03" />

                {zoom && timeLabels.map((_, i) => (
                  <line
                    key={i}
                    x1={i * (812 / 23)} y1="0"
                    x2={i * (812 / 23)} y2="256"
                    stroke="#1f1f1f"
                    strokeWidth="1"
                  />
                ))}

                {!loading && (
                  <path
                    key={`${activeTab}-${zoom}-${selectedDate.getTime()}`}
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
                )}

                {chartData[23] > 0 && (
                  <rect x="804" y={256 - (chartData[23]/(isTemp?50:100))*256 - 5} width="8" height="10" fill="#FDD34D" />
                )}
              </g>
            </svg>

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
