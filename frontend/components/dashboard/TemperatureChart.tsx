"use client";

import { useState, useRef, useEffect } from "react";
import { dashboardService, AdafruitData } from "@/lib/api/dashboard";

/* ── 24 hourly labels ─────────────────────────────────────── */
const timeLabels = [
  "00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00",
  "08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00",
];

const tempYLabels = ["50°C", "40°C", "30°C", "20°C", "10°C", "0°C"];
const humidYLabels = ["100%", "80%", "60%", "40%", "20%", "0%"];

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
  // Each index represents 3 minutes. Total day is 1440 minutes.
  return data.map((val, i) => {
    const totalMins = i * 3;
    const x = (totalMins / 1440) * 812;
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
        console.log(`DEBUG: Fetched ${data.length} history items for sensor ${sensorId}`);
        if (data.length > 0) {
           console.log(`DEBUG: Latest data point: ${data[0].created_at}, value: ${data[0].value}`);
           console.log(`DEBUG: Oldest data point: ${data[data.length-1].created_at}`);
        }
        setHistory(data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, [selectedDate, activeTab, isTemp]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Process data for the chart (aggregate to 480 slots: 24h * 20 slices of 3 mins)
  const chartData = Array(24 * 20).fill(0);
  const counts = Array(24 * 20).fill(0);

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);
  const startTs = startOfDay.getTime();

  history.forEach(d => {
    const dTs = new Date(d.created_at).getTime();
    const diffMins = (dTs - startTs) / (1000 * 60);
    const index = Math.floor(diffMins / 3);
    
    if (index >= 0 && index < 480) {
      chartData[index] += parseFloat(d.value);
      counts[index]++;
    }
  });

  // Calculate averages
  for (let i = 0; i < 480; i++) {
    if (counts[i] > 0) {
      chartData[i] = chartData[i] / counts[i];
    }
  }

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
          {yLabels.map(label => (
            <span key={label} className="font-jakarta font-bold text-[10px]" style={{ color: "#ADAAAA" }}>{label}</span>
          ))}
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
                <line x1="0" y1="56"  x2="812" y2="56"  stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="106" x2="812" y2="106" stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="156" x2="812" y2="156" stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="206" x2="812" y2="206" stroke="#484847" strokeWidth="1.03" strokeDasharray="2.06 2.06" />
                <line x1="0" y1="256" x2="812" y2="256" stroke="#484847" strokeWidth="1.03" />

                {zoom && timeLabels.map((_, i) => (
                  <line
                    key={i}
                    x1={(i * 60 / 1440) * 812} y1="0"
                    x2={(i * 60 / 1440) * 812} y2="256"
                    stroke="#1f1f1f"
                    strokeWidth="1"
                  />
                ))}

                {!loading && (
                  <path
                    key={`${activeTab}-${zoom}-${selectedDate.getTime()}`}
                    d={chartPath}
                    stroke="#FDD34D"
                    strokeWidth="2"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                    style={{
                      strokeDasharray: "none",
                      strokeDashoffset: 0,
                    }}
                  />
                )}

                {chartData[chartData.length - 1] > 0 && (
                  <rect x="804" y={256 - (chartData[chartData.length - 1]/(isTemp?50:100))*256 - 5} width="8" height="10" fill="#FDD34D" />
                )}
              </g>
            </svg>

            <div className="relative mt-1" style={{ height: "18px" }}>
              {timeLabels.map((label, i) => (
                <span
                  key={label}
                  className="absolute font-jakarta font-bold uppercase whitespace-nowrap"
                  style={{
                    left: `${(i * 60 / 1440) * 100}%`,
                    transform: i === 0 ? "none" : i === 23 ? "translateX(-50%)" : "translateX(-50%)",
                    color: "#ADAAAA",
                    fontSize: zoom ? "11px" : "10px",
                    top: 0,
                  }}
                >
                  {label}
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
