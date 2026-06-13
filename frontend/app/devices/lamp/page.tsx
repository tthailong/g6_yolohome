"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import LightTopNav from "@/components/dashboard/LightTopNav";
import { useDevices } from "@/app/context/DeviceContext";
import { Loader2 } from "lucide-react";

/* ── Icons ───────────────────────────────────────────────────────── */
const BulbIcon = () => (
  <svg width="60" height="84" viewBox="0 0 24 34" fill="none">
    <path d="M12 0C5.37258 0 0 5.37258 0 12C0 16.0353 2.01633 19.6053 5 21.6445V25C5 26.1046 5.89543 27 7 27H17C18.1046 27 19 26.1046 19 25V21.6445C21.9837 19.6053 24 16.0353 24 12C24 5.37258 18.6274 0 12 0ZM7 31H17V29H7V31ZM10 34H14V32H10V34Z" fill="currentColor"/>
  </svg>
);

const SunSmallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 4V2H12.01V4H12ZM12 20V22H12.01V20H12ZM4 12H2V12.01H4V12ZM22 12H20V12.01H22V12ZM6.34 6.34L4.93 4.93L4.92 4.92L6.33 6.33L6.34 6.34ZM17.66 17.66L19.07 19.07L19.08 19.08L17.67 17.67L17.66 17.66ZM17.66 6.34L19.07 4.93L19.08 4.92L17.67 6.33L17.66 6.34ZM6.34 17.66L4.93 19.07L4.92 19.08L6.33 17.67L6.34 17.66Z" fill="#ADAAAA"/>
  </svg>
);

const SunLargeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19ZM12 3V1H12.01V3H12ZM12 21V23H12.01V21H12ZM3 12H1V12.01H3V12ZM23 12H21V12.01H23V12ZM5.64 5.64L4.23 4.23L4.22 4.22L5.63 5.63L5.64 5.64ZM18.36 18.36L19.77 19.77L19.78 19.78L18.37 18.37L18.36 18.36ZM18.36 5.64L19.77 4.23L19.78 4.22L18.37 5.63L18.36 5.64ZM5.64 18.36L4.23 19.77L4.22 19.78L5.63 18.37L5.64 18.36Z" fill="#FDD34D"/>
  </svg>
);

/* ── Components ──────────────────────────────────────────────────── */

export default function SmartLightPage() {
  const router = useRouter();
  const { deviceStates, pendingDevices, updateDeviceState, isLoading } = useDevices();
  const [showRightPanel, setShowRightPanel] = useState(true);



  const isOn = deviceStates["dadn.led-state"] === "1";
  const isPending = pendingDevices["dadn.led-state"] === true;
  const rawBrightness = deviceStates["dadn.led-sate"] || "85";
  const brightness = Math.round(parseFloat(rawBrightness));

  const brightnessTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActionTime = useRef(0);

  const handleBrightnessChange = (value: number) => {
    if (brightnessTimerRef.current) {
      clearTimeout(brightnessTimerRef.current);
    }

    brightnessTimerRef.current = setTimeout(async () => {
      try {
        const normalizedValue = value;
        lastActionTime.current = Date.now();
        await updateDeviceState("dadn.led-sate", normalizedValue);
      } catch (error) {
        console.error("Failed to set brightness:", error);
      }
    }, 1000);
  };

  const handleToggle = async () => {
    if (isPending) return;
    const nextState = !isOn;
    lastActionTime.current = Date.now();
    try {
      const valueToSend = nextState ? "1" : "0";
      await updateDeviceState("dadn.led-state", valueToSend);
    } catch (error) {
      console.error("Failed to control light state:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 md:ml-20">
        <LightTopNav 
          showNotifications={false}
          onToggleNotifications={() => {}}
          title="Lamp"
        />

        <main className="flex-1 mt-14 overflow-hidden flex flex-row relative">
          {/* Loading Blocker Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-50 flex flex-col items-center justify-center transition-all duration-300">
              <Loader2 className="w-10 h-10 animate-spin text-[#FDD34D] mb-4" />
              <p className="font-mono text-xs tracking-widest text-[#FDD34D] uppercase animate-pulse">
                Syncing status...
              </p>
            </div>
          )}
          {/* Sidebar Toggle Button (Dedicated) */}
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="absolute top-1/2 -translate-y-1/2 right-0 z-20 w-8 h-12 flex items-center justify-center rounded-l-xl transition-all duration-300"
            style={{ 
              background: "#1A1A1A", 
              border: "1px solid #262626", 
              borderRight: "none",
              marginRight: showRightPanel ? "340px" : "0px",
              boxShadow: "-4px 0 12px rgba(0,0,0,0.5)"
            }}
          >
            <svg 
              width="18" height="18" viewBox="0 0 24 24" fill="none" 
              className={`transition-transform duration-500 ${showRightPanel ? "rotate-180" : ""}`}
            >
              <path d="M15 18L9 12L15 6" stroke={showRightPanel ? "#FDD34D" : "#ADAAAA"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* ── Left Column: Main Light Control ── */}
          <div className="flex-1 overflow-y-auto px-8 py-8 md:py-12 flex flex-col items-center w-full transition-all duration-300 scrollbar-hide">
            
            {/* Header */}
            <div className="text-center mb-10 w-full relative">
              <h3 className="font-jakarta text-[10px] uppercase tracking-widest text-[#ADAAAA] mb-2">Device Status</h3>
              <h1 className="font-manrope font-extrabold text-4xl text-white tracking-tight">Lamp</h1>
            </div>

            {/* Central Graphic */}
            <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-12 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={isPending ? undefined : handleToggle}>
              
              {/* Outer faint rings */}
              <div
                className="absolute inset-0 rounded-full transition-all duration-700"
                style={{
                  border: isOn ? "1px solid rgba(253,211,77,0.15)" : "1px solid rgba(255,255,255,0.05)",
                  transform: isOn ? "scale(1.2)" : "scale(1)",
                  opacity: isOn ? 1 : 0.5
                }}
              />
              <div
                className="absolute inset-0 rounded-full transition-all duration-700"
                style={{
                  border: isOn ? "1px solid rgba(253,211,77,0.25)" : "1px solid rgba(255,255,255,0.1)",
                  transform: "scale(0.9)",
                  background: isOn ? "radial-gradient(circle, rgba(253,211,77,0.1) 0%, transparent 70%)" : "transparent",
                  boxShadow: isOn ? "0 0 60px 0 rgba(253,211,77,0.1)" : "none"
                }}
              />
              
              {/* Core Light Circle */}
              <div
                className="relative w-[180px] h-[180px] rounded-full flex items-center justify-center transition-all duration-500 z-10"
                style={{
                  background: isOn ? "linear-gradient(135deg, #FDD34D 0%, #E8AA00 100%)" : "#262626",
                  boxShadow: isOn ? "0 0 80px 10px rgba(253,211,77,0.4), inset 0 0 20px rgba(255,255,255,0.5)" : "inset 0 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                <div style={{ color: isOn ? "#5C4900" : "#ADAAAA" }}>
                  {isPending ? (
                    <Loader2 className="w-12 h-12 animate-spin" />
                  ) : (
                    <BulbIcon />
                  )}
                </div>
              </div>
            </div>

            {/* Brightness Pill */}
            <div className="px-5 py-2 rounded-2xl mb-12 border transition-all duration-300" style={{ background: "#1A1A1A", borderColor: isOn ? "rgba(253,211,77,0.3)" : "#484847" }}>
              <span className="font-jakarta font-bold text-sm" style={{ color: isOn ? "#FDD34D" : "#ADAAAA" }}>
                {isOn ? `${brightness}% Brightness` : "Off"}
              </span>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-5 w-full max-w-[400px] mb-20 px-4">
              <SunSmallIcon />
              <div className="relative flex-1 h-1.5 rounded-full" style={{ background: "#484847" }}>
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
                  style={{ width: `${brightness}%`, background: isOn ? "#FDD34D" : "#888" }}
                />
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-200"
                  style={{ left: `calc(${brightness}% - 10px)` }}
                />
              </div>
              <SunLargeIcon />
            </div>

            {/* Automated Schedule */}
            <div className="w-full max-w-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-manrope font-bold text-lg text-white">Light Schedule</h3>
                <button className="flex items-center gap-1.5 font-jakarta font-bold text-[11px] uppercase tracking-widest text-[#FDD34D] hover:underline">
                  <span className="text-sm leading-none">+</span> Add New Rule
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Morning Mode */}
                <div className="flex-1 rounded-2xl p-5" style={{ background: "#1A1A1A" }}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,209,251,0.1)", color: "#F5D1FB" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4V2M12 22V20M4 12H2M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    {/* Toggle Component */}
                    <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer" style={{ background: "#484847" }}>
                      <div className="w-4 h-4 rounded-full bg-[#FDD34D] transform translate-x-5 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <p className="font-jakarta text-[10px] text-[#ADAAAA] mb-1">Morning Mode</p>
                    <p className="font-manrope font-bold text-sm text-white mb-4">06:00 AM — 08:30 AM</p>
                    <div className="flex items-center gap-2 font-jakarta text-[10px] text-[#ADAAAA]">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="currentColor"/></svg>
                      Set Brightness to 30%
                    </div>
                  </div>
                </div>

                {/* Sleep Mode */}
                <div className="flex-1 rounded-2xl p-5" style={{ background: "#1A1A1A" }}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(173,170,170,0.1)", color: "#ADAAAA" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    {/* Toggle Component OFF */}
                    <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer" style={{ background: "#262626" }}>
                      <div className="w-4 h-4 rounded-full bg-[#888] transform translate-x-0 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <p className="font-jakarta text-[10px] text-[#ADAAAA] mb-1">Sleep Mode</p>
                    <p className="font-manrope font-bold text-sm text-white mb-4">11:00 PM — 06:00 AM</p>
                    <div className="flex items-center gap-2 font-jakarta text-[10px] text-[#ADAAAA]">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 4V2M12 20V22M4 12H2M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Auto Off
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Other Devices ── */}
          <div
            className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0"
            style={{
              width: showRightPanel ? "340px" : "0px",
              opacity: showRightPanel ? 1 : 0,
              background: "#121212",
              borderLeft: showRightPanel ? "1px solid #262626" : "none"
            }}
          >
            <aside className="w-[340px] h-full overflow-y-auto pt-8 pb-10 px-8 flex flex-col gap-10 scrollbar-hide">
              {/* Living Room Area */}
              <div>
                <h2 className="font-manrope font-bold text-lg text-white mb-6">Living Room</h2>
                <div className="flex flex-col gap-3">
                  {/* Ceiling Fan */}
                  <div 
                    onClick={() => router.push("/devices/fan")}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-[#262626] transition-colors relative" 
                    style={{ background: "#1A1A1A" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#262626] text-[#ADAAAA]">
                      <svg 
                        width="20" height="20" viewBox="0 0 24 24" fill="none"
                        className={deviceStates["dadn.fan-state"] === "1" ? "animate-spin-slow" : ""}
                        style={{ animationDuration: '2s' }}
                      >
                        <path d="M10.85 12c0-1.25-.11-2.43-.31-3.53C10.15 6.44 9.19 5 7.81 5c-1.52 0-2.75 2.1-2.75 4.69 0 2.14.85 3.93 2.1 4.51.52.24 1.14.3 1.76.3H10.85Z" fill="currentColor"/>
                        <path d="M12 10.85c1.25 0 2.43-.11 3.53-.31 2.03-.39 3.47-1.35 3.47-2.73 0-1.52-2.1-2.75-4.69-2.75-2.14 0-3.93.85-4.51 2.1-.24.52-.3 1.14-.3 1.76v1.93Z" fill="currentColor"/>
                        <path d="M13.15 12c0 1.25.11 2.43.31 3.53.39 2.03 1.35 3.47 2.73 3.47 1.52 0 2.75-2.1 2.75-4.69 0-2.14-.85-3.93-2.1-4.51-.52-.24-1.14-.3-1.76-.3h-1.93Z" fill="currentColor"/>
                        <path d="M12 13.15c-1.25 0-2.43.11-3.53.31-2.03.39-3.47 1.35-3.47 2.73 0 1.52 2.1 2.75 4.69 2.75 2.14 0 3.93-.85 4.51-2.1.24-.52.3-1.14.3-1.76v-1.93Z" fill="currentColor"/>
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-manrope font-bold text-sm text-white">Ceiling Fan</h4>
                      <p className="font-jakarta text-[10px] text-[#ADAAAA] mt-0.5">
                        {deviceStates["dadn.fan-state"] === "1" ? `Speed ${deviceStates["dadn.fan-speed"] || 0}% • On` : "Off"}
                      </p>
                    </div>
                    {deviceStates["dadn.fan-state"] === "1" && (
                      <div className="absolute right-4 w-3 h-3 rounded-full bg-[#FDD34D] flex items-center justify-center">
                        <svg width="6" height="6" viewBox="0 0 8 8" fill="none"><path d="M3 6.5L0.5 4L1.2 3.3L3 5.1L6.8 1.3L7.5 2L3 6.5Z" fill="#5C4900"/></svg>
                      </div>
                    )}
                  </div>

                  {/* Air Purifier */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-[#262626] transition-colors" style={{ background: "#1A1A1A" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#262626] text-[#ADAAAA]">
                      <svg width="18" height="14" viewBox="0 0 24 18" fill="none"><path d="M0 18V16H14C14.8333 16 15.5417 15.7083 16.125 15.125C16.7083 14.5417 17 13.8333 17 13C17 12.1667 16.7083 11.4583 16.125 10.875C15.5417 10.2917 14.8333 10 14 10H10V8H14C15.3833 8 16.5625 8.4875 17.5375 9.4625C18.5125 10.4375 19 11.6167 19 13C19 14.3833 18.5125 15.5625 17.5375 16.5375C16.5625 17.5125 15.3833 18 14 18H0ZM0 11V9H9C9.56667 9 10.0417 8.80417 10.425 8.4125C10.8083 8.02083 11 7.55 11 7C11 6.45 10.8083 5.97917 10.425 5.5875C10.0417 5.19583 9.56667 5 9 5H0V3H9C10.1 3 11.0417 3.39167 11.825 4.175C12.6083 4.95833 13 5.9 13 7C13 8.1 12.6083 9.04167 11.825 9.825C11.0417 10.6083 10.1 11 9 11H0ZM0 4V2H19C20.1 2 21.0417 1.60833 21.825 0.825C22.6083 0.0416667 23 -0.9 23 -2C23 -3.1 22.6083 -4.04167 21.825 -4.825C21.0417 -5.60833 20.1 -6 19 -6H16V-8H19C20.6667 -8 22.0833 -7.41667 23.25 -6.25C24.4167 -5.08333 25 -3.66667 25 -2C25 -0.333333 24.4167 1.08333 23.25 2.25C22.0833 3.41667 20.6667 4 19 4H0Z" fill="currentColor"/></svg>
                    </div>
                    <div>
                      <h4 className="font-manrope font-bold text-sm text-white">Air Purifier</h4>
                      <p className="font-jakarta text-[10px] text-[#ADAAAA] mt-0.5">Auto • 98% Quality</p>
                    </div>
                  </div>

                  {/* Smart TV (Offline) */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-[#262626] transition-colors opacity-70" style={{ background: "#1A1A1A" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#262626] text-[#ADAAAA]">
                      <svg width="18" height="14" viewBox="0 0 20 16" fill="none"><path d="M2.5 13H17.5V3H2.5V13ZM2.5 15C1.8125 15 1.22917 14.7552 0.75 14.2656C0.270833 13.776 0.03125 13.1875 0 12.5V3.5C0 2.8125 0.239583 2.224 0.71875 1.7345C1.19792 1.245 1.78646 1.00017 2.48438 1H17.5C18.1875 1 18.776 1.24483 19.2656 1.7345C19.7552 2.22417 20 2.81267 20 3.5V12.5C20 13.1875 19.7552 13.776 19.2656 14.2656C18.776 14.7552 18.1875 15 17.5 15H2.5ZM7 18V16H13V18H7Z" fill="currentColor"/></svg>
                    </div>
                    <div>
                      <h4 className="font-manrope font-bold text-sm text-[#ADAAAA]">Smart TV</h4>
                      <p className="font-jakarta text-[10px] text-[#888] mt-0.5">Offline</p>
                    </div>
                  </div>
                </div>
              </div>


            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
