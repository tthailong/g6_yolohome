import React from "react";

const activities = [
  {
    category: "URGENT",
    title: "Detect earthquake!",
    description: "Seismic activity detected in Zone B. Executing safety lock.",
    time: "2m ago",
    theme: "urgent", // Reddish
  },
  {
    category: "CLIMATE",
    title: "Temperature is high",
    description: "Living room at 36°C. Activating cooling systems.",
    time: "15m ago",
    theme: "climate", // Yellowish
  },
  {
    category: "SECURITY",
    title: "Face Identified: Alex",
    description: "Front door unlocked by recognized family member.",
    time: "45m ago",
    theme: "security", // Default dark
  },
  {
    category: "DEVICE",
    title: "Vacuuming Complete",
    description: "Living room cleaning finished. Returning to base.",
    time: "1h ago",
    theme: "device", // Default dark
  },
];

const activityThemes: Record<string, { bg: string; border: string; title: string; category: string }> = {
  urgent: {
    bg: "rgba(255, 115, 81, 0.1)",
    border: "rgba(255, 115, 81, 0.3)",
    title: "#FFF",
    category: "#FF7351",
  },
  climate: {
    bg: "rgba(252, 211, 77, 0.1)",
    border: "rgba(252, 211, 77, 0.3)",
    title: "#FFF",
    category: "#FDD34D",
  },
  security: {
    bg: "rgba(173, 170, 170, 0.1)",
    border: "rgba(173, 170, 170, 0.3)",
    title: "#FFF",
    category: "#ADAAAA",
  },
  device: {
    bg: "rgba(173, 170, 170, 0.1)",
    border: "rgba(173, 170, 170, 0.3)",
    title: "#FFF",
    category: "#ADAAAA",
  },
};

export default function RecentActivity() {
  return (
    <aside
      className="flex flex-col gap-8 p-6 md:p-8 rounded-xl h-full w-full"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16ZM16 17H8V11C8 8.52 9.51 6.5 12 6.5C14.49 6.5 16 8.52 16 11V17Z" fill="#FDD34D" />
        </svg>
        <h2 className="font-manrope font-extrabold text-lg text-white">Recent Activity</h2>
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-4 overflow-y-auto">
        {activities.map((activity, index) => {
          const theme = activityThemes[activity.theme];
          return (
            <div
              key={index}
              className="flex flex-col gap-2 p-4 rounded-xl transition-all duration-300 hover:brightness-125"
              style={{
                background: theme.bg,
                border: `1px solid ${theme.border}`,
              }}
            >
              <div className="flex justify-between items-start">
                <span className="font-jakarta font-bold text-[8px] tracking-widest uppercase" style={{ color: theme.category }}>
                  {activity.category}
                </span>
                <span className="font-jakarta font-medium text-[8px]" style={{ color: "#ADAAAA" }}>
                  {activity.time}
                </span>
              </div>
              <h4 className="font-manrope font-extrabold text-sm text-white">{activity.title}</h4>
              <p className="font-jakarta font-medium text-[10px] leading-relaxed" style={{ color: "rgba(173, 170, 170, 0.8)" }}>
                {activity.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* View All Button */}
      <button
        className="mt-auto w-full py-3 rounded-lg border font-jakarta font-bold text-[10px] uppercase tracking-widest text-[#ADAAAA] transition-colors hover:text-white hover:border-[#ADAAAA]"
        style={{ borderColor: "#484847" }}
      >
        View All Activity
      </button>
    </aside>
  );
}
