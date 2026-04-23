"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import EmergencyAlert from "@/components/dashboard/EmergencyAlert";
import StatCards from "@/components/dashboard/StatCards";
import TemperatureChart from "@/components/dashboard/TemperatureChart";
import FaceDetectionChart from "@/components/dashboard/FaceDetectionChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { WebSocketClient } from "@/lib/api/socket";

export default function DashboardPage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeAlert, setActiveAlert] = useState<{type: "fire" | "earthquake" | "none", message?: string}>({
    type: "none"
  });

  // Listen for emergency alerts via WebSocket
  useEffect(() => {
    // Assuming Home ID 1 for now
    const ws = new WebSocketClient(1, (message) => {
      if (message.type === "SENSOR_UPDATE") {
        if (message.feed_name === "dadn.fire-detected" && message.value === "1") {
          setActiveAlert({ type: "fire", message: "Flame detected in your home! Buzzer active." });
        } else if (message.feed_name === "dadn.earthquake-detected" && message.value === "1") {
          setActiveAlert({ type: "earthquake", message: "Seismic vibrations detected! Please seek shelter." });
        } else if (message.value === "0") {
          // Auto-clear alert if sensor value goes back to 0
          setActiveAlert(prev => {
            if (message.feed_name.includes(prev.type)) return { type: "none" };
            return prev;
          });
        }
      }
    });

    ws.connect();
    return () => ws.disconnect();
  }, []);

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
            <EmergencyAlert 
              type={activeAlert.type} 
              message={activeAlert.message} 
              onDismiss={() => setActiveAlert({ type: "none" })}
            />

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
