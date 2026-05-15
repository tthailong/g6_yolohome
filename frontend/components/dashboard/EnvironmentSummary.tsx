"use client";

import { useDevices } from "@/app/context/DeviceContext";

export default function EnvironmentSummary() {
  const { deviceStates } = useDevices();
  
  const temp = deviceStates["dadn.dht20-temperature"] || "--";
  const humid = deviceStates["dadn.dht20-humidity"] || "--";

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#484847]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#FDD34D]" />
        <span className="font-manrope font-bold text-sm text-white">{temp}°C</span>
        <span className="font-jakarta text-[10px] text-[#ADAAAA] uppercase tracking-wider">Temp</span>
      </div>
      <div className="w-[1px] h-4 bg-[#484847]" />
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />
        <span className="font-manrope font-bold text-sm text-white">{humid}%</span>
        <span className="font-jakarta text-[10px] text-[#ADAAAA] uppercase tracking-wider">Humid</span>
      </div>
    </div>
  );
}
