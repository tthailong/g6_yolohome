"use client";

interface EmergencyAlertProps {
  type: "fire" | "earthquake" | "none";
  message?: string;
  onDismiss?: () => void;
}

export default function EmergencyAlert({ type, message, onDismiss }: EmergencyAlertProps) {
  if (type === "none") return null;

  const isFire = type === "fire";
  
  const config = {
    fire: {
      title: "Fire Emergency Detected",
      defaultMessage: "Flame detected in Kitchen! Buzzer active. All safety doors unlocked. Please exit immediately!",
      bg: "#FF5722",
      shadow: "0 0 20px 0 rgba(255, 87, 34, 0.50)",
      btnBg: "#FFF",
      btnColor: "#FF5722",
      icon: (
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
          <path d="M0 11C0 9.25 0.416667 7.69167 1.25 6.325C2.08333 4.95833 3 3.80833 4 2.875C5 1.94167 5.91667 1.22917 6.75 0.7375C7.58333 0.245833 8 0 8 0V3.3C8 3.91667 8.20833 4.40417 8.625 4.7625C9.04167 5.12083 9.50833 5.3 10.025 5.3C10.3083 5.3 10.5792 5.24167 10.8375 5.125C11.0958 5.00833 11.3333 4.81667 11.55 4.55L12 4C13.2 4.7 14.1667 5.67083 14.9 6.9125C15.6333 8.15417 16 9.51667 16 11C16 12.4667 15.6417 13.8042 14.925 15.0125C14.2083 16.2208 13.2667 17.175 12.1 17.875C12.3833 17.475 12.6042 17.0375 12.7625 16.5625C12.9208 16.0875 13 15.5833 13 15.05C13 14.3833 12.875 13.7542 12.625 13.1625C12.375 12.5708 12.0167 12.0417 11.55 11.575L8 8.1L4.475 11.575C3.99167 12.0583 3.625 12.5917 3.375 13.175C3.125 13.7583 3 14.3833 3 15.05C3 15.5833 3.07917 16.0875 3.2375 16.5625C3.39583 17.0375 3.61667 17.475 3.9 17.875C2.73333 17.175 1.79167 16.2208 1.075 15.0125C0.358333 13.8042 0 12.4667 0 11ZM8 10.9L10.125 12.975C10.4083 13.2583 10.625 13.575 10.775 13.925C10.925 14.275 11 14.65 11 15.05C11 15.8667 10.7083 16.5625 10.125 17.1375C9.54167 17.7125 8.83333 18 8 18C7.16667 18 6.45833 17.7125 5.875 17.1375C5.29167 16.5625 5 15.8667 5 15.05C5 14.6667 5.075 14.2958 5.225 13.9375C5.375 13.5792 5.59167 13.2583 5.875 12.975L8 10.9Z" fill="white" />
        </svg>
      )
    },
    earthquake: {
      title: "Earthquake Warning",
      defaultMessage: "Seismic activity detected! Take cover under sturdy furniture immediately. Stay away from windows!",
      bg: "#8D6E63", // Dark Brown/Earth
      shadow: "0 0 20px 0 rgba(141, 110, 99, 0.50)",
      btnBg: "#FFD54F", // Yellow/Gold
      btnColor: "#3E2723",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 13l4-4 4 4 4-4 4 4 4-4" />
          <path d="M2 17l4-4 4 4 4-4 4 4 4-4" />
          <line x1="2" y1="21" x2="22" y2="21" />
        </svg>
      )
    }
  }[type];

  return (
    <div
      className="flex items-center justify-between w-full px-4 py-4 rounded-xl animate-in fade-in slide-in-from-top duration-500"
      style={{ background: config.bg, boxShadow: config.shadow }}
    >
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center p-2 rounded-lg flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.20)" }}
        >
          {config.icon}
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="font-manrope font-extrabold text-sm uppercase tracking-tight text-white">
            {config.title}
          </p>
          <p className="font-jakarta font-medium text-xs" style={{ color: "rgba(255,255,255,0.9)" }}>
            {message || config.defaultMessage}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onDismiss}
          className="flex-shrink-0 px-4 py-2 rounded-lg font-jakarta font-bold text-[10px] uppercase tracking-widest cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: "#FFF" }}
        >
          Dismiss
        </button>
        <button
          className="flex-shrink-0 px-4 py-2 rounded-lg font-jakarta font-bold text-[10px] uppercase tracking-widest cursor-pointer"
          style={{ background: config.btnBg, color: config.btnColor, letterSpacing: "1px", boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)" }}
        >
          {isFire ? "Exit Now" : "Seek Shelter"}
        </button>
      </div>
    </div>
  );
}
