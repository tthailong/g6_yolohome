"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import LightTopNav from "@/components/dashboard/LightTopNav";
import { useDevices } from "@/app/context/DeviceContext";
import { Loader2 } from "lucide-react";

/* ── Icons ───────────────────────────────────────────────────────── */
const FanIcon = ({ isOn }: { isOn: boolean }) => (
  <svg 
    width="80" height="80" viewBox="0 0 24 24" fill="none"
    className={isOn ? "animate-spin-slow" : ""}
    style={{ animationDuration: '1.5s' }}
  >
    <path d="M10.85 12c0-1.25-.11-2.43-.31-3.53C10.15 6.44 9.19 5 7.81 5c-1.52 0-2.75 2.1-2.75 4.69 0 2.14.85 3.93 2.1 4.51.52.24 1.14.3 1.76.3H10.85Z" fill="currentColor"/>
    <path d="M12 10.85c1.25 0 2.43-.11 3.53-.31 2.03-.39 3.47-1.35 3.47-2.73 0-1.52-2.1-2.75-4.69-2.75-2.14 0-3.93.85-4.51 2.1-.24.52-.3 1.14-.3 1.76v1.93Z" fill="currentColor"/>
    <path d="M13.15 12c0 1.25.11 2.43.31 3.53.39 2.03 1.35 3.47 2.73 3.47 1.52 0 2.75-2.1 2.75-4.69 0-2.14-.85-3.93-2.1-4.51-.52-.24-1.14-.3-1.76-.3h-1.93Z" fill="currentColor"/>
    <path d="M12 13.15c-1.25 0-2.43.11-3.53.31-2.03.39-3.47 1.35-3.47 2.73 0 1.52 2.1 2.75 4.69 2.75 2.14 0 3.93-.85 4.51-2.1.24-.52.3-1.14.3-1.76v-1.93Z" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

const SpeedLowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14H12V22L22 10H13V2Z" stroke="#ADAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SpeedHighIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14H12V22L22 10H13V2Z" fill="#FDD34D" stroke="#FDD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Components ──────────────────────────────────────────────────── */

export default function SmartFanPage() {
  const router = useRouter();
  const { deviceStates, pendingDevices, updateDeviceState } = useDevices();
  const [showRightPanel, setShowRightPanel] = useState(true);

  const isOn = deviceStates["dadn.fan-state"] === "1";
  const isPending = pendingDevices["dadn.fan-state"] === true;
  const rawSpeed = deviceStates["dadn.fan-speed"] || "50";
  const speed = Math.round(parseFloat(rawSpeed));

  const speedTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActionTime = useRef(0);

  const handleSpeedChange = (value: number) => {
    if (speedTimerRef.current) {
      clearTimeout(speedTimerRef.current);
    }

    speedTimerRef.current = setTimeout(async () => {
      try {
        lastActionTime.current = Date.now();
        await updateDeviceState("dadn.fan-speed", value);
      } catch (error) {
        console.error("Failed to set fan speed:", error);
      }
    }, 1000);
  };

  const handleToggle = async () => {
    if (isPending) return;
    const nextState = !isOn;
    lastActionTime.current = Date.now();
    try {
      const valueToSend = nextState ? "1" : "0";
      await updateDeviceState("dadn.fan-state", valueToSend);
      if (nextState && speed < 50) {
        await updateDeviceState("dadn.fan-speed", "50");
      }
    } catch (error) {
      console.error("Failed to control fan state:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 md:ml-20">
        <LightTopNav 
          showNotifications={false}
          onToggleNotifications={() => {}}
          title="Ceiling Fan Control"
        />

        <main className="flex-1 mt-14 overflow-hidden flex flex-row relative">
          {/* Sidebar Toggle Button */}
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

          {/* ── Left Column: Main Fan Control ── */}
          <div className="flex-1 overflow-y-auto px-8 py-8 md:py-12 flex flex-col items-center w-full transition-all duration-300 scrollbar-hide">
            
            {/* Header */}
            <div className="text-center mb-10 w-full relative">
              <h3 className="font-jakarta text-[10px] uppercase tracking-widest text-[#ADAAAA] mb-2">Device Status</h3>
              <h1 className="font-manrope font-extrabold text-4xl text-white tracking-tight">Ceiling Fan</h1>
            </div>

            {/* Central Graphic */}
            <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-12 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={isPending ? undefined : handleToggle}>
              
              {/* Outer faint rings (Matching Lamp Page) */}
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
              
              {/* Core Fan Circle */}
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
                    <FanIcon isOn={isOn} />
                  )}
                </div>
              </div>
            </div>

            {/* Speed Pill */}
            <div className="px-5 py-2 rounded-2xl mb-12 border transition-all duration-300" style={{ background: "#1A1A1A", borderColor: isOn ? "rgba(253,211,77,0.3)" : "#484847" }}>
              <span className="font-jakarta font-bold text-sm" style={{ color: isOn ? "#FDD34D" : "#ADAAAA" }}>
                {isOn ? `${speed}% Speed` : "Off"}
              </span>
            </div>

            {/* Slider */}
            <div className="flex items-center gap-5 w-full max-w-[400px] mb-20 px-4">
              <SpeedLowIcon />
              <div className="relative flex-1 h-1.5 rounded-full" style={{ background: "#484847" }}>
                <div
                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-200"
                  style={{ width: `${speed}%`, background: isOn ? "#FDD34D" : "#888" }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={speed}
                  onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute top-1/2 -mt-2.5 w-5 h-5 bg-white rounded-full shadow-lg pointer-events-none transition-all duration-200"
                  style={{ left: `calc(${speed}% - 10px)` }}
                />
              </div>
              <SpeedHighIcon />
            </div>

            {/* Automated Schedule */}
            <div className="w-full max-w-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-manrope font-bold text-lg text-white">Fan Schedule</h3>
                <button className="flex items-center gap-1.5 font-jakarta font-bold text-[11px] uppercase tracking-widest text-[#FDD34D] hover:underline">
                  <span className="text-sm leading-none">+</span> Add New Rule
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 rounded-2xl p-5" style={{ background: "#1A1A1A" }}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,209,251,0.1)", color: "#F5D1FB" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4V2M12 22V20M4 12H2M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer" style={{ background: "#484847" }}>
                      <div className="w-4 h-4 rounded-full bg-[#FDD34D] transform translate-x-5 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <p className="font-jakarta text-[10px] text-[#ADAAAA] mb-1">Cooling Mode</p>
                    <p className="font-manrope font-bold text-sm text-white mb-4">12:00 PM — 04:00 PM</p>
                    <div className="flex items-center gap-2 font-jakarta text-[10px] text-[#ADAAAA]">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="currentColor"/></svg>
                      Set Speed to 70%
                    </div>
                  </div>
                </div>

                <div className="flex-1 rounded-2xl p-5" style={{ background: "#1A1A1A" }}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(173,170,170,0.1)", color: "#ADAAAA" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
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
              <div>
                <h2 className="font-manrope font-bold text-lg text-white mb-6">Living Room</h2>
                <div className="flex flex-col gap-3">
                  {/* Smart Lamp */}
                  <div 
                    onClick={() => router.push("/devices/lamp")}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-[#262626] transition-colors relative" 
                    style={{ background: "#1A1A1A" }}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#262626] text-[#ADAAAA]">
                      <svg width="16" height="22" viewBox="0 0 24 34" fill="none">
                        <path d="M12 0C5.37258 0 0 5.37258 0 12C0 16.0353 2.01633 19.6053 5 21.6445V25C5 26.1046 5.89543 27 7 27H17C18.1046 27 19 26.1046 19 25V21.6445C21.9837 19.6053 24 16.0353 24 12C24 5.37258 18.6274 0 12 0ZM7 31H17V29H7V31ZM10 34H14V32H10V34Z" fill="currentColor"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-manrope font-bold text-sm text-white">Main Chandelier</h4>
                      <p className="font-jakarta text-[10px] text-[#ADAAAA] mt-0.5">
                        {deviceStates["dadn.led-state"] === "1" ? `${deviceStates["dadn.led-sate"] || 85}% intensity` : "Off"}
                      </p>
                    </div>
                    {deviceStates["dadn.led-state"] === "1" && (
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
                </div>
              </div>

              {/* Efficiency Tip */}
              <div className="rounded-2xl p-5 border border-[rgba(253,211,77,0.1)] mt-auto" style={{ background: "linear-gradient(180deg, rgba(253,211,77,0.05) 0%, rgba(26,26,26,0.8) 100%)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill="#FDD34D" stroke="#FDD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-jakarta font-bold text-[11px] text-[#FDD34D] uppercase tracking-widest">Efficiency Tip</span>
                </div>
                <p className="font-jakarta text-[11px] text-[#ADAAAA] leading-relaxed mb-5">
                  Running the fan at 50% instead of 100% reduces energy consumption by over 40%.
                </p>
                <button 
                  className="w-full py-2.5 rounded-xl font-manrope font-bold text-xs text-white bg-[#2A2A2A] hover:bg-[#333] active:bg-[#222] transition-colors border border-[#484847]"
                >
                  Optimize All
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
