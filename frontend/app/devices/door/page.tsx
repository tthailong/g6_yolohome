"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import LightTopNav from "@/components/dashboard/LightTopNav";

export default function SmartDoorPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 md:ml-20">
        <LightTopNav 
          showNotifications={showRightPanel}
          onToggleNotifications={() => setShowRightPanel((v) => !v)}
        />

        <main className="flex-1 mt-14 overflow-hidden flex flex-row">
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center transition-all duration-300">
             <div className="mb-10">
                <h3 className="font-jakarta text-[10px] uppercase tracking-widest text-[#ADAAAA] mb-2">Security Status</h3>
                <h1 className="font-manrope font-extrabold text-4xl text-white tracking-tight">Main Entrance</h1>
             </div>
             
             {/* Simple Lock Placeholder */}
             <div 
               className="w-64 h-64 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500"
               style={{ 
                 background: isLocked ? "rgba(213,61,24,0.1)" : "rgba(45,106,79,0.1)",
                 border: isLocked ? "2px solid #D53D18" : "2px solid #2d6a4f",
                 boxShadow: isLocked ? "0 0 40px rgba(213,61,24,0.2)" : "0 0 40px rgba(45,106,79,0.2)"
               }}
               onClick={() => setIsLocked(!isLocked)}
             >
                <div style={{ color: isLocked ? "#D53D18" : "#2d6a4f" }}>
                   {isLocked ? (
                     <svg width="60" height="80" viewBox="0 0 16 20" fill="none"><path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6H3V4C3 2.9 3.39167 1.95833 4.175 1.175C4.95833 0.391667 5.9 0 7 0H9C10.1 0 11.0417 0.391667 11.825 1.175C12.6083 1.95833 13 2.9 13 4V6H14C14.55 6 15.0208 6.19583 15.4125 6.5875C15.8042 6.97917 16 7.45 16 8V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H8ZM5 6H11V4C11 3.45 10.8042 2.97917 10.4125 2.5875C10.0208 2.19583 9.55 2 9 2H7C6.45 2 5.97917 2.19583 5.5875 2.5875C5.19583 2.97917 5 3.45 5 4V6Z" fill="currentColor"/></svg>
                   ) : (
                     <svg width="60" height="80" viewBox="0 0 16 20" fill="none"><path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 17.0208 0 16.55 0 16V8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6H11V4C11 3.45 10.85 2.95 10.45 2.55C10.05 2.15 9.55 1.95 9 1.95H7C6.45 1.95 5.95 2.15 5.55 2.55C5.15 2.95 4.95 3.45 4.95 4V6H2.95V4C2.95 2.85 3.35 1.9 4.15 1.15C4.95 0.35 5.9  -0.05 7 -0.05H9C10.1 -0.05 11.05 0.35 11.85 1.15C12.65 1.9 13.05 2.85 13.05 4V6H14C14.55 6 15.0208 6.19583 15.4125 6.5875C15.8042 6.97917 16 7.45 16 8V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H2V20ZM8 14C8.55 14 9.02083 13.8042 9.4125 13.4125C9.80417 13.0208 10 12.55 10 12C10 11.45 9.80417 10.9792 9.4125 10.5875C9.02083 10.1958 8.55 10 8 10C7.45 10 6.97917 10.1958 6.5875 10.5875C6.19583 10.9792 6 11.45 6 12C6 12.55 6.19583 13.0208 6.5875 13.4125C6.97917 14.8042 7.45 14 8 14Z" fill="currentColor"/></svg>
                   )}
                </div>
             </div>
             
             <p className="mt-8 font-jakarta text-sm text-[#ADAAAA]">
                Tap to {isLocked ? "Unlock" : "Lock"} Entrance
             </p>
          </div>

          <div
            className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0"
            style={{
              width: showRightPanel ? "340px" : "0px",
              opacity: showRightPanel ? 1 : 0,
              background: "#121212",
              borderLeft: showRightPanel ? "1px solid #262626" : "none"
            }}
          >
            <aside className="w-[340px] h-full p-8 flex flex-col gap-10">
               <h2 className="font-manrope font-bold text-lg text-white">Security History</h2>
               <div className="flex flex-col gap-4">
                  <div className="p-4 rounded-xl bg-[#1A1A1A] border border-[#262626]">
                     <p className="text-[10px] text-[#ADAAAA] uppercase">Last Action</p>
                     <p className="text-sm font-bold text-white mt-1">Locked by User at 10:45 PM</p>
                  </div>
               </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
