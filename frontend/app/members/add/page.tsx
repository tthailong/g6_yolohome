"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, User, ShieldCheck, Eye } from "lucide-react";

export default function AddMemberPage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedRole, setSelectedRole] = useState("member");

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
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Top Bar with Back Button */}
              <div className="flex items-center gap-4 border-b border-[#2A2A2A] pb-4">
                <Link href="/members">
                  <Button variant="ghost" className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Thêm Thành Viên Mới</h1>
              </div>

              <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 space-y-8">
                
                {/* User Info Input */}
                <div className="space-y-4">
                  <p className="text-[#ADAAAA] text-sm">
                    Gửi lời mời tham gia quản lý nhà G6 YoloHome. Họ sẽ nhận được thông báo qua Email.
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-white">Email người dùng</label>
                    <div className="relative">
                      <Input 
                        type="email"
                        placeholder="nhap.email@example.com" 
                        className="bg-[#0E0E0E] border-[#2A2A2A] text-white py-6 pl-12"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ADAAAA] w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-white">Phân quyền (Role Management)</label>
                  
                  <div className="grid gap-4">
                    {/* Role: Admin */}
                    <div 
                      onClick={() => setSelectedRole("admin")}
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedRole === "admin" 
                        ? "border-[#FDD34D] bg-[#FDD34D]/5" 
                        : "border-[#2A2A2A] bg-[#252525] hover:border-[#ADAAAA]"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedRole === "admin" ? "bg-[#FDD34D]/20 text-[#FDD34D]" : "bg-[#1A1A1A] text-[#ADAAAA]"}`}>
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${selectedRole === "admin" ? "text-[#FDD34D]" : "text-white"}`}>Quản trị viên (Admin)</h3>
                        <p className="text-sm text-[#ADAAAA] mt-1">Có toàn quyền điều khiển thiết bị, thêm/xóa thiết bị và quản lý thành viên khác.</p>
                      </div>
                    </div>

                    {/* Role: Member */}
                    <div 
                      onClick={() => setSelectedRole("member")}
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedRole === "member" 
                        ? "border-[#FDD34D] bg-[#FDD34D]/5" 
                        : "border-[#2A2A2A] bg-[#252525] hover:border-[#ADAAAA]"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${selectedRole === "member" ? "bg-[#FDD34D]/20 text-[#FDD34D]" : "bg-[#1A1A1A] text-[#ADAAAA]"}`}>
                        <Eye className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${selectedRole === "member" ? "text-[#FDD34D]" : "text-white"}`}>Thành viên (Member)</h3>
                        <p className="text-sm text-[#ADAAAA] mt-1">Chỉ có quyền xem trạng thái và điều khiển các thiết bị được cấp phép.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex justify-end gap-4">
                  <Link href="/members">
                    <Button variant="ghost" className="text-[#ADAAAA] hover:text-white">
                      Hủy
                    </Button>
                  </Link>
                  <Button className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold px-8">
                    Gửi lời mời
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