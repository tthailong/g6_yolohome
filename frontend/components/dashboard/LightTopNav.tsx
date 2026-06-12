"use client";

import Link from "next/link";
import EnvironmentSummary from "./EnvironmentSummary";

export default function LightTopNav({
  showNotifications = true,
  onToggleNotifications,
  title = "Ceiling Glow",
}: {
  showNotifications?: boolean;
  onToggleNotifications?: () => void;
  title?: string;
}) {
  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between h-14 px-6 md:px-8"
      style={{
        left: "80px",
        background: "rgba(14,14,14,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(72,72,71,0.4)",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link href="/devices" className="flex items-center justify-center p-1 cursor-pointer">
          <svg width="6" height="10" viewBox="0 0 8 12" fill="none">
            <path d="M7.41 10.59L2.83 6L7.41 1.41L6 0L0 6L6 12L7.41 10.59Z" fill="#FFF"/>
          </svg>
        </Link>
        <div className="font-jakarta text-sm font-semibold tracking-wide">
          <span className="text-white">Devices</span>
          <span className="text-[#ADAAAA] mx-1">/</span>
          <span className="text-white">Living Room</span>
          <span className="text-[#ADAAAA] mx-1">/</span>
          <span style={{ color: "#FDD34D" }}>{title}</span>
        </div>
      </div>

      {/* Right: Environment Summary (instead of Search) + Bell + Avatar */}
      <div className="flex items-center gap-4 md:gap-5">
        <div className="hidden md:block">
          <EnvironmentSummary />
        </div>

        {/* Bell - Only show if toggle function is provided */}
        {onToggleNotifications && (
          <button
            onClick={onToggleNotifications}
            className="relative p-1 rounded-lg transition-all duration-200 hover:bg-[#1A1A1A]"
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none"
              style={{ filter: showNotifications ? "drop-shadow(0 0 6px #FDD34D)" : "none" }}
            >
              <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20Z"
                fill={showNotifications ? "#FDD34D" : "#ADAAAA"}
              />
            </svg>
            {showNotifications && (
              <span
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                style={{ background: "#FDD34D" }}
              />
            )}
          </button>
        )}

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
          style={{ background: "#FFD8CA" }}
        >
          <img
            src="https://img.pokemondb.net/artwork/large/dragonair.jpg"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
