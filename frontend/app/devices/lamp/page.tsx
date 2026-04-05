"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import LightTopNav from "@/components/dashboard/LightTopNav";

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
  const [isOn, setIsOn] = useState(true);
  const [brightness, setBrightness] = useState(85);
  const [showRightPanel, setShowRightPanel] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 md:ml-20">
        <LightTopNav 
          showNotifications={false}
          onToggleNotifications={() => {}}
        />

        <main className="flex-1 mt-14 overflow-hidden flex flex-row relative">
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
              <h1 className="font-manrope font-extrabold text-4xl text-white tracking-tight">Main Light</h1>
            </div>

            {/* Central Graphic */}
            <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-12 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => setIsOn(!isOn)}>
              
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
                  <BulbIcon />
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
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setBrightness(v);
                    if (v > 0) setIsOn(true);
                  }}
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
                <h3 className="font-manrope font-bold text-lg text-white">Automated Schedule</h3>
                <button className="flex items-center gap-1.5 font-jakarta font-bold text-[11px] uppercase tracking-widest text-[#FDD34D] hover:underline">
                  <span className="text-sm leading-none">+</span> Add New Rule
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Morning Warmth */}
                <div className="flex-1 rounded-2xl p-5" style={{ background: "#1A1A1A" }}>
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(245,209,251,0.1)", color: "#F5D1FB" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4V2M12 22V20M4 12H2M22 12H20M6.34 6.34L4.93 4.93M17.66 17.66L19.07 19.07M17.66 6.34L19.07 4.93M6.34 17.66L4.93 19.07M12 18C8.686 18 6 15.314 6 12C6 8.686 8.686 6 12 6C15.314 6 18 8.686 18 12C18 15.314 15.314 18 12 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                    {/* Toggle Component */}
                    <div className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer" style={{ background: "#484847" }}>
                      <div className="w-4 h-4 rounded-full bg-[#FDD34D] transform translate-x-5 transition-transform" />
                    </div>
                  </div>
                  <div>
                    <p className="font-jakarta text-[10px] text-[#ADAAAA] mb-1">Morning Warmth</p>
                    <p className="font-manrope font-bold text-sm text-white mb-4">07:30 AM — 09:00 AM</p>
                    <div className="flex items-center gap-2 font-jakarta text-[10px] text-[#ADAAAA]">
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="currentColor"/></svg>
                      Gradual Increase to 60%
                    </div>
                  </div>
                </div>

                {/* Night Mode */}
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
                    <p className="font-jakarta text-[10px] text-[#ADAAAA] mb-1">Night Mode</p>
                    <p className="font-manrope font-bold text-sm text-white mb-4">11:00 PM — 06:00 AM</p>
                    <div className="flex items-center gap-2 font-jakarta text-[10px] text-[#ADAAAA]">
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 4V2M12 20V22M4 12H2M22 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      Auto Shut-off
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column: Devices List (Toggleable) ── */}
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
                  <div className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer hover:bg-[#262626] transition-colors relative" style={{ background: "#1A1A1A" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#262626] text-[#ADAAAA]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 13C12.55 13 13.0208 12.8042 13.4125 12.4125C13.8042 12.0208 14 11.55 14 11C14 10.45 13.8042 9.97917 13.4125 9.5875C13.0208 9.19583 12.55 9 12 9C11.45 9 10.9792 9.19583 10.5875 9.5875C10.1958 9.97917 10 10.45 10 11C10 11.55 10.1958 12.0208 10.5875 12.4125C10.9792 12.8042 11.45 13 12 13ZM12 24C11.1 24 10.3958 23.6417 9.8875 22.925C9.37917 22.2083 9.2 21.4167 9.35 20.55L9.9 17.5C8.83333 17.1667 7.85833 16.6667 6.975 16C6.09167 15.3333 5.35 14.5333 4.75 13.6L2 14.85C1.2 15.2167 0.391667 15.1958 -0.425 14.7875C-1.24167 14.3792 -1.75 13.7167 -1.95 12.8L-2 12C-2 11.1 -1.64167 10.3958 -0.925 9.8875C-0.208333 9.37917 0.583333 9.2 1.45 9.35L4.5 9.9C4.83333 8.83333 5.33333 7.85833 6 6.975C6.66667 6.09167 7.46667 5.35 8.4 4.75L7.15 2C6.78333 1.2 6.80417 0.391667 7.2125 -0.425C7.62083 -1.24167 8.28333 -1.75 9.2 -1.95L10 -2C10.9 -2 11.6042 -1.64167 12.1125 -0.925C12.6208 -0.208333 12.8 0.583333 12.65 1.45L12.1 4.5C13.1667 4.83333 14.1417 5.33333 15.025 6C15.9083 6.66667 16.65 7.46667 17.25 8.4L20 7.15C20.8 6.78333 21.6083 6.80417 22.425 7.2125C23.2417 7.62083 23.75 8.28333 23.95 9.2L24 10C24 10.9 23.6417 11.6042 22.925 12.1125C22.2083 12.6208 21.4167 12.8 20.55 12.65L17.5 12.1C17.1667 13.1667 16.6667 14.1417 16 15.025C15.3333 15.9083 14.5333 16.65 13.6 17.25L14.85 20C15.2167 20.8 15.1958 21.6083 14.7875 22.425C14.3792 23.2417 13.7167 23.75 12.8 23.95L12 24Z" fill="currentColor"/></svg>
                    </div>
                    <div>
                      <h4 className="font-manrope font-bold text-sm text-white">Ceiling Fan</h4>
                      <p className="font-jakarta text-[10px] text-[#ADAAAA] mt-0.5">Speed 3 • On</p>
                    </div>
                    <div className="absolute right-4 w-3 h-3 rounded-full bg-[#FDD34D] flex items-center justify-center">
                      <svg width="6" height="6" viewBox="0 0 8 8" fill="none"><path d="M3 6.5L0.5 4L1.2 3.3L3 5.1L6.8 1.3L7.5 2L3 6.5Z" fill="#5C4900"/></svg>
                    </div>
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

              {/* Efficiency Tip */}
              <div className="rounded-2xl p-5 border border-[rgba(253,211,77,0.1)] mt-auto" style={{ background: "linear-gradient(180deg, rgba(253,211,77,0.05) 0%, rgba(26,26,26,0.8) 100%)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill="#FDD34D" stroke="#FDD34D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="font-jakarta font-bold text-[11px] text-[#FDD34D] uppercase tracking-widest">Efficiency Tip</span>
                </div>
                <p className="font-jakarta text-[11px] text-[#ADAAAA] leading-relaxed mb-5">
                  Lowering brightness to 75% will save approx. 12% energy monthly without noticeable visibility loss.
                </p>
                <button 
                  onClick={() => setBrightness(75)}
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
