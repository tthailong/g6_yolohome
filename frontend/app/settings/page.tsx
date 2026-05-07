"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [showNotifications, setShowNotifications] = useState(true);

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
            <div className="max-w-3xl mx-auto space-y-8">
              
              <h1 className="text-3xl font-bold">Cài đặt (Settings)</h1>

              <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-semibold border-b border-[#2A2A2A] pb-4">Hồ sơ cá nhân</h2>
                
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center text-3xl font-bold">
                    DQ
                  </div>
                  <Button variant="outline" className="border-[#FDD34D] text-[#FDD34D] hover:bg-[#FDD34D] hover:text-[#5C4900]">
                    Thay đổi Avatar
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm text-[#ADAAAA]">Họ và Tên</label>
                    <Input className="bg-[#0E0E0E] border-[#2A2A2A] text-white" defaultValue="Đặng Quang Dũng" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#ADAAAA]">Email</label>
                    <Input className="bg-[#0E0E0E] border-[#2A2A2A] text-white" defaultValue="dung@example.com" disabled />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#ADAAAA]">Số điện thoại</label>
                    <Input className="bg-[#0E0E0E] border-[#2A2A2A] text-white" placeholder="+84..." />
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-6">
                <h2 className="text-xl font-semibold border-b border-[#2A2A2A] pb-4">Tùy chọn hiển thị & Thông báo</h2>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Nhận thông báo thiết bị</h3>
                    <p className="text-sm text-[#ADAAAA]">Gửi cảnh báo về điện thoại khi có thay đổi trạng thái (Cửa, Khói...)</p>
                  </div>
                  <div className="w-12 h-6 bg-[#FDD34D] rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-[#5C4900] rounded-full absolute right-1 top-1"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="ghost" className="text-[#ADAAAA] hover:text-white">Hủy</Button>
                <Button className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold">Lưu thay đổi</Button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}