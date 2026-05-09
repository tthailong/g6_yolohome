"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import EmergencyAlert from "@/components/dashboard/EmergencyAlert";
import StatCards from "@/components/dashboard/StatCards";
import TemperatureChart from "@/components/dashboard/TemperatureChart";
import FaceDetectionChart from "@/components/dashboard/FaceDetectionChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // State quản lý loại cảnh báo: "fire", "earthquake", hoặc "none"
  // Đặt tạm là "fire" để bạn thấy giao diện, khi chạy thực tế có thể set mặc định là "none"
  const [alertType, setAlertType] = useState<"fire" | "earthquake" | "none">("fire");

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
        {/* Fixed Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 md:ml-20">
          {/* Fixed Top Navigation */}
          <TopNav
            showNotifications={showNotifications}
            onToggleNotifications={() => setShowNotifications((v) => !v)}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Dashboard Content Container */}
          <main className="flex flex-1 mt-14 overflow-hidden relative">
            {/* Central Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 scrollbar-hide transition-all duration-300 relative">
              
              {/* Cung cấp props type và hàm onDismiss cho EmergencyAlert */}
              <EmergencyAlert 
                type={alertType} 
                onDismiss={() => setAlertType("none")} 
              />
              
              <section className="space-y-6">
                <StatCards />

                <div className="grid grid-cols-1 gap-6">
                  <TemperatureChart selectedDate={selectedDate} />
                  <FaceDetectionChart />
                </div>
              </section>
            </div>

            {/* Right Sidebar - Recent Activity (toggleable) */}
            <div
              className="hidden xl:flex flex-col overflow-hidden transition-all duration-300 ease-in-out border-l border-[#262626] bg-[#0A0A0A]"
              style={{
                width: showNotifications ? "360px" : "0px",
                opacity: showNotifications ? 1 : 0,
              }}
            >
              <div className="w-[360px] h-full overflow-y-auto scrollbar-hide">
                <RecentActivity />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}