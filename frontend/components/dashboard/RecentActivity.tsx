import React, { useEffect, useState } from "react";
import { useDevices } from "@/app/context/DeviceContext";
import { dashboardService } from "@/lib/api/dashboard";

interface Activity {
  category: string;
  title: string;
  description: string;
  time: string;
  theme: string;
}

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

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  const isThisYear = date.getFullYear() === now.getFullYear();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'short',
    ...(isThisYear ? {} : { year: 'numeric' })
  };
  
  const dateStr = date.toLocaleDateString('vi-VN', dateOptions);
  const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  if (diffMins < 0) return timeStr; // Future date?
  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước (${timeStr})`;
  if (diffHours < 24) return `${timeStr}, ${dateStr}`;
  return `${dateStr} ${timeStr}`;
};

export default function RecentActivity() {
  const { selectedHomeId } = useDevices();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!selectedHomeId) return;
      try {
        setLoading(true);
        const data = await dashboardService.getActivities(selectedHomeId, 10);
        setActivities(data);
      } catch (error) {
        console.error("Failed to fetch activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    // Refresh every minute
    const interval = setInterval(fetchActivities, 60000);
    return () => clearInterval(interval);
  }, [selectedHomeId]);

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
      <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2">
        {loading && activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FDD34D] mx-auto mb-4"></div>
            <p className="text-[#ADAAAA] text-xs">Fetching records...</p>
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity, index) => {
            const theme = activityThemes[activity.theme] || activityThemes.device;
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
                    {formatTime(activity.time)}
                  </span>
                </div>
                <h4 className="font-manrope font-extrabold text-sm text-white">{activity.title}</h4>
                <p className="font-jakarta font-medium text-[10px] leading-relaxed" style={{ color: "rgba(173, 170, 170, 0.8)" }}>
                  {activity.description}
                </p>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 border border-dashed border-[#484847] rounded-xl">
             <p className="text-[#ADAAAA] text-xs">No recent activity detected.</p>
          </div>
        )}
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

