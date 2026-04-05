"use client";

import Link from "next/link";

export default function LightTopNav({
  showNotifications = true,
  onToggleNotifications,
}: {
  showNotifications?: boolean;
  onToggleNotifications?: () => void;
}) {
  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between h-14 px-6 md:px-8"
      style={{
        left: "80px",
        background: "transparent", 
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
          <span style={{ color: "#FDD34D" }}>Ceiling Glow</span>
        </div>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div className="flex items-center gap-4 md:gap-5">
        {/* Search */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg w-48 lg:w-64"
          style={{ background: "#262626", border: "1px solid #484847" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M12.45 13.5L7.725 8.775C7.35 9.075 6.91875 9.3125 6.43125 9.4875C5.94375 9.6625 5.425 9.75 4.875 9.75C3.5125 9.75 2.35938 9.27813 1.41562 8.33438C0.471875 7.39063 0 6.2375 0 4.875C0 3.5125 0.471875 2.35938 1.41562 1.41562C2.35938 0.471875 3.5125 0 4.875 0C6.2375 0 7.39063 0.471875 8.33438 1.41562C9.27813 2.35938 9.75 3.5125 9.75 4.875C9.75 5.425 9.6625 5.94375 9.4875 6.43125C9.3125 6.91875 9.075 7.35 8.775 7.725L13.5 12.45L12.45 13.5ZM4.875 8.25C5.8125 8.25 6.60938 7.92188 7.26562 7.26562C7.92188 6.60938 8.25 5.8125 8.25 4.875C8.25 3.9375 7.92188 3.14062 7.26562 2.48438C6.60938 1.82812 5.8125 1.5 4.875 1.5C3.9375 1.5 3.14062 1.82812 2.48438 2.48438C1.82812 3.14062 1.5 3.9375 1.5 4.875C1.5 5.8125 1.82812 6.60938 2.48438 7.26562C3.14062 7.92188 3.9375 8.25 4.875 8.25Z" fill="#ADAAAA"/>
          </svg>
          <span className="font-jakarta text-[10px] tracking-widest uppercase" style={{ color: "#ADAAAA" }}>
            SEARCH...
          </span>
        </div>

        {/* Bell */}
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

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
          style={{ background: "#FFD8CA" }}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/b37aa6d1c6cbc969bfe2b07a8b3ddc5dc6d58170?width=60"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
