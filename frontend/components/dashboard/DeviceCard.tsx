"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type DeviceStatus = "on" | "off" | "locked" | "standby";

export interface DeviceCardData {
  id: string;
  name: string;
  subtitle?: string;
  status: DeviceStatus;
  room?: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: string;
  /** when on, use primary yellow glow card */
  isActive?: boolean;
  /** secondary purple tint (mood/atmospheric) */
  isMood?: boolean;
  /** hide the on/off toggle (e.g. locks) */
  noToggle?: boolean;
  /** link to the detailed control page */
  href?: string;
}

interface DeviceCardProps {
  device: DeviceCardData;
}

export default function DeviceCard({ device }: DeviceCardProps) {
  const router = useRouter();
  const [isOn, setIsOn] = useState(device.isActive ?? device.status === "on");

  const isYellow = isOn && !device.isMood;
  const isMood = device.isMood;

  const bg = isYellow
    ? "bg-[#FDD34D]"
    : isMood
    ? "bg-[#2D1A33]"
    : "bg-[#1A1A1A]";

  const textColor = isYellow ? "text-[#5C4900]" : "text-white";
  const subColor = isYellow ? "text-[#7A6200]" : "text-[#ADAAAA]";

  const handleCardClick = () => {
    if (device.href) {
      router.push(device.href);
    } else if (!device.isMood) {
      setIsOn((v) => !v);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl p-4 cursor-pointer transition-all duration-300 select-none min-h-[130px] ${bg} hover:shadow-lg`}
      style={{
        boxShadow: isYellow
          ? "0 0 32px 0 rgba(253,211,77,0.18)"
          : isMood
          ? "0 0 24px 0 rgba(245,209,251,0.08)"
          : "none",
      }}
      onClick={handleCardClick}
    >
      {/* Badge */}
      {device.badge && (
        <span
          className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
          style={{
            background: device.badgeColor ?? "#D53D18",
            color: "#fff",
          }}
        >
          {device.badge}
        </span>
      )}

      {/* Top Row: icon + toggle */}
      <div className="flex items-start justify-between">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isYellow ? "bg-[#fce280]" : isMood ? "bg-[#3D1F45]" : "bg-[#262626]"
          }`}
        >
          <span className={isYellow ? "text-[#5C4900]" : isMood ? "text-[#F5D1FB]" : "text-[#ADAAAA]"}>
            {device.icon}
          </span>
        </div>

        {/* Toggle — hidden when noToggle is set */}
        {!device.noToggle && (
          <button
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
              isOn ? (isMood ? "bg-[#b57bcc]" : "bg-[#5C4900]") : "bg-[#484847]"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsOn((v) => !v);
            }}
            aria-label="toggle"
          >
            <span
              className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                isOn ? "left-[18px] bg-[#FDD34D]" : "left-0.5 bg-[#ADAAAA]"
              }`}
            />
          </button>
        )}
      </div>

      {/* Bottom content */}
      <div className="mt-3">
        <p className={`font-manrope font-semibold text-sm leading-tight ${textColor}`}>
          {device.name}
        </p>
        {device.subtitle && (
          <p className={`font-jakarta text-[11px] mt-0.5 ${subColor}`}>
            {device.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/** The "+ Add Device" placeholder card */
export function AddDeviceCard({ onClick }: { onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl min-h-[130px] cursor-pointer transition-all duration-200 hover:bg-[#1A1A1A] group"
      style={{ background: "transparent" }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#262626] group-hover:bg-[#FDD34D] transition-colors duration-200">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="group-hover:text-[#5C4900] text-[#ADAAAA] transition-colors duration-200"
        >
          <path d="M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z" fill="currentColor" />
        </svg>
      </div>
      <span className="font-jakarta text-[11px] text-[#ADAAAA] group-hover:text-white transition-colors">
        Add Device
      </span>
    </div>
  );
}
