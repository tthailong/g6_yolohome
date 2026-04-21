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

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 ml-[60px] md:ml-20">
        {/* Fixed Top Navigation */}
        <TopNav
          showNotifications={showNotifications}
          onToggleNotifications={() => setShowNotifications((v) => !v)}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* Dashboard Content Container */}
        <main className="flex flex-1 mt-16 overflow-hidden">
          {/* Central Scrollable Area — expands when panel hidden */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 scrollbar-hide transition-all duration-300">
            <EmergencyAlert />

            <section className="space-y-6">
              <StatCards />

              <div className="grid grid-cols-1 gap-8">
                <TemperatureChart selectedDate={selectedDate} />
                <FaceDetectionChart />
              </div>
            </section>
          </div>

          {/* Right Sidebar - Recent Activity (toggleable) */}
          <div
            className="hidden xl:flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              width: showNotifications ? "24rem" : "0px",
              opacity: showNotifications ? 1 : 0,
              padding: showNotifications ? undefined : "0px",
            }}
          >
            <div className="w-96 h-full p-4 md:p-8 sticky top-0 shrink-0">
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
