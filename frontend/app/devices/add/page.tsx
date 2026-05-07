"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Lightbulb, ThermometerSun, DoorOpen, MonitorPlay } from "lucide-react";

const deviceTypes = [
  { id: "light", name: "Đèn thông minh", icon: <Lightbulb className="w-8 h-8 mb-2" /> },
  { id: "climate", name: "Cảm biến nhiệt/ẩm", icon: <ThermometerSun className="w-8 h-8 mb-2" /> },
  { id: "door", name: "Khóa cửa & Camera", icon: <DoorOpen className="w-8 h-8 mb-2" /> },
  { id: "other", name: "Thiết bị khác", icon: <MonitorPlay className="w-8 h-8 mb-2" /> },
];

export default function AddDevicePage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState("");

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 ml-[60px] md:ml-20">
          <TopNav
            showNotifications={showNotifications}
            onToggleNotifications={() => setShowNotifications(!showNotifications)}
            selectedDate={new Date()}
            onSelectDate={() => {}}
          />
          <main className="flex-1 mt-16 p-4 md:p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Top Bar with Back Button */}
              <div className="flex items-center gap-4 border-b border-[#2A2A2A] pb-4">
                <Link href="/devices">
                  <Button variant="ghost" className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Thêm Thiết Bị Mới</h1>
              </div>

              <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 space-y-8">
                {/* Step 1: Device Type Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">1. Chọn loại thiết bị</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {deviceTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={`flex flex-col items-center justify-center p-6 rounded-xl cursor-pointer transition-all border-2 ${
                          selectedType === type.id
                            ? "bg-[#FDD34D]/10 border-[#FDD34D] text-[#FDD34D]"
                            : "bg-[#252525] border-transparent text-[#ADAAAA] hover:bg-[#2A2A2A] hover:text-white"
                        }`}
                      >
                        {type.icon}
                        <span className="text-sm font-medium text-center">{type.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Device Details */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">2. Thông tin thiết bị</h2>
                  <div className="space-y-2">
                    <label className="text-sm text-[#ADAAAA]">Tên thiết bị</label>
                    <Input 
                      placeholder="VD: Đèn trần phòng khách" 
                      className="bg-[#0E0E0E] border-[#2A2A2A] text-white py-6"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#ADAAAA]">Mã kết nối (Feed/ID)</label>
                    <Input 
                      placeholder="Nhập mã thiết bị..." 
                      className="bg-[#0E0E0E] border-[#2A2A2A] text-white py-6"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-6 flex justify-end gap-4">
                  <Link href="/devices">
                    <Button variant="outline" className="border-[#2A2A2A] text-[#ADAAAA] hover:text-white hover:bg-[#2A2A2A]">
                      Hủy bỏ
                    </Button>
                  </Link>
                  <Button 
                    className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold px-8"
                    disabled={!selectedType || !deviceName}
                  >
                    Kết nối thiết bị
                  </Button>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}