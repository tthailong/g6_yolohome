"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Home as HomeIcon, Key, Server, Trash2, ShieldAlert } from "lucide-react";

export default function ManageHomePage() {
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
            <div className="max-w-3xl mx-auto space-y-6">
              
              {/* Top Bar with Back Button */}
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <div className="flex items-center gap-4">
                  <Link href="/homes">
                    <Button variant="ghost" className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full">
                      <ArrowLeft className="w-6 h-6" />
                    </Button>
                  </Link>
                  <h1 className="text-2xl font-bold">Quản lý Nhà (Manage Home)</h1>
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 space-y-8">
                
                {/* Thông tin cơ bản */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-[#2A2A2A] pb-2">
                    <HomeIcon className="w-5 h-5 text-[#FDD34D]" />
                    Thông tin chung
                  </h2>
                  <div className="space-y-2">
                    <label className="text-sm text-[#ADAAAA]">Tên ngôi nhà (Sanctuary Name)</label>
                    <Input 
                      defaultValue="Obsidian Heights" 
                      className="bg-[#0E0E0E] border-[#2A2A2A] text-white py-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-[#ADAAAA]">Mô tả / Phân loại</label>
                    <Input 
                      defaultValue="Primary Residence" 
                      className="bg-[#0E0E0E] border-[#2A2A2A] text-white py-6"
                    />
                  </div>
                </div>

                {/* Cấu hình Server (Adafruit IO) */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-[#2A2A2A] pb-2 mt-8">
                    <Server className="w-5 h-5 text-[#FDD34D]" />
                    Cấu hình Máy chủ (Adafruit IO)
                  </h2>
                  <p className="text-sm text-[#ADAAAA]">
                    Nhập thông tin kết nối MQTT để hệ thống có thể giao tiếp với các thiết bị phần cứng của bạn.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Adafruit Username</label>
                    <Input 
                      placeholder="Nhập username..." 
                      className="bg-[#0E0E0E] border-[#2A2A2A] text-white py-6"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Adafruit IO Key</label>
                    <div className="relative">
                      <Input 
                        type="password"
                        placeholder="aio_..." 
                        className="bg-[#0E0E0E] border-[#2A2A2A] text-white py-6 pr-12"
                      />
                      <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADAAAA] w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="space-y-4 pt-8">
                  <h2 className="text-lg font-semibold flex items-center gap-2 border-b border-[#D53D18]/30 text-[#D53D18] pb-2">
                    <ShieldAlert className="w-5 h-5" />
                    Khu vực nguy hiểm (Danger Zone)
                  </h2>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#D53D18]/5 p-4 rounded-xl border border-[#D53D18]/20">
                    <div>
                      <h3 className="font-semibold text-white">Xóa ngôi nhà này</h3>
                      <p className="text-sm text-[#ADAAAA] mt-1">Hành động này không thể hoàn tác. Toàn bộ thiết bị và dữ liệu thành viên sẽ bị xóa.</p>
                    </div>
                    <Button variant="outline" className="border-[#D53D18] text-[#D53D18] hover:bg-[#D53D18] hover:text-white transition-colors shrink-0">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa vĩnh viễn
                    </Button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-6 flex justify-end gap-4">
                  <Link href="/homes">
                    <Button variant="outline" className="border-[#2A2A2A] text-[#ADAAAA] hover:text-white hover:bg-[#2A2A2A]">
                      Hủy bỏ
                    </Button>
                  </Link>
                  <Button className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold px-8">
                    Lưu cấu hình
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