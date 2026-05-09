"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
  const [showNotifications, setShowNotifications] = useState(true);

  // Dữ liệu mẫu (Mock data) chờ API
  const members = [
    { id: 1, name: "Gia Hân", role: "Owner", email: "han@example.com", status: "Active" },
    { id: 2, name: "Ngọc Dung", role: "Admin", email: "dung@example.com", status: "Active" },
    { id: 3, name: "Bảo Hân", role: "Member", email: "baohan@example.com", status: "Pending" },
  ];

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
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center bg-[#1A1A1A] p-6 rounded-2xl">
                <div>
                  <h1 className="text-2xl font-bold">Quản lý thành viên</h1>
                  <p className="text-[#ADAAAA] text-sm mt-1">Cài đặt quyền truy cập thiết bị cho nhà của bạn.</p>
                </div>
                <Button className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold">
                  + Thêm thành viên
                </Button>
              </div>

              {/* Members List */}
              <div className="bg-[#1A1A1A] rounded-2xl p-6">
                <div className="grid grid-cols-1 gap-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-4 border border-[#2A2A2A] rounded-xl hover:bg-[#252525] transition">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-lg font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-[#ADAAAA]">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`px-3 py-1 text-xs rounded-full ${member.role === 'Owner' ? 'bg-[#FDD34D]/20 text-[#FDD34D]' : 'bg-gray-700'}`}>
                          {member.role}
                        </span>
                        <Button variant="outline" className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]">
                          Quản lý
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}