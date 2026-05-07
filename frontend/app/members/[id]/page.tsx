"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar, ShieldAlert, Trash2, KeyRound, Clock } from "lucide-react";
import { useParams } from "next/navigation";

export default function ViewMemberPage() {
  const params = useParams();
  const [showNotifications, setShowNotifications] = useState(true);

  // Dữ liệu mẫu (Mock data) của thành viên đang xem
  const member = {
    id: params.id,
    name: "Ngọc Dung",
    role: "Admin",
    email: "dung@example.com",
    phone: "+84 987 654 321",
    joinedDate: "15 Tháng 3, 2026",
    status: "Active",
    accessibleDevices: [
      { id: 1, name: "Main Chandelier", room: "Living Room", type: "Light" },
      { id: 2, name: "Front Door Lock", room: "Bedroom & Security", type: "Lock" },
    ],
    recentActivities: [
      { id: 1, action: "Đã mở khóa cửa chính", time: "Hôm nay, 08:30 AM" },
      { id: 2, action: "Đã tắt đèn phòng khách", time: "Hôm qua, 11:45 PM" },
    ]
  };

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
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Header & Back Button */}
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <div className="flex items-center gap-4">
                  <Link href="/members">
                    <Button variant="ghost" className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full">
                      <ArrowLeft className="w-6 h-6" />
                    </Button>
                  </Link>
                  <h1 className="text-2xl font-bold">Thông tin thành viên</h1>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-[#2A2A2A] text-white hover:bg-[#2A2A2A]">
                    <ShieldAlert className="w-4 h-4 mr-2" />
                    Đổi quyền
                  </Button>
                  <Button variant="outline" className="border-[#D53D18]/50 text-[#D53D18] hover:bg-[#D53D18]/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa thành viên
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Cột trái: Thông tin cá nhân */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Profile Card */}
                  <div className="bg-[#1A1A1A] rounded-2xl p-6 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-3xl font-bold mb-4 shadow-lg">
                      {member.name.charAt(0)}
                    </div>
                    <h2 className="text-xl font-bold">{member.name}</h2>
                    <span className={`inline-block px-3 py-1 mt-2 text-xs font-semibold rounded-full ${member.role === 'Admin' ? 'bg-[#FDD34D]/20 text-[#FDD34D]' : 'bg-gray-700 text-gray-300'}`}>
                      {member.role}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-4">
                    <h3 className="font-semibold text-[#ADAAAA] uppercase text-xs tracking-wider mb-2">Liên hệ & Trạng thái</h3>
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-[#ADAAAA]" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-[#ADAAAA]" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-[#ADAAAA]" />
                      <span>Đã tham gia: {member.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Cột phải: Quyền hạn & Lịch sử */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Thiết bị được phép điều khiển */}
                  <div className="bg-[#1A1A1A] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <KeyRound className="w-5 h-5 text-[#FDD34D]" />
                        Thiết bị có quyền truy cập
                      </h3>
                    </div>
                    <div className="space-y-3">
                      {member.accessibleDevices.map(device => (
                        <div key={device.id} className="flex justify-between items-center p-4 bg-[#252525] rounded-xl border border-[#2A2A2A]">
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-xs text-[#ADAAAA] mt-1">{device.room}</p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-[#131313] rounded text-[#ADAAAA]">
                            {device.type}
                          </span>
                        </div>
                      ))}
                      {member.role === 'Admin' && (
                        <p className="text-sm text-[#FDD34D] mt-2 italic">* Quản trị viên có quyền truy cập tất cả thiết bị trong nhà.</p>
                      )}
                    </div>
                  </div>

                  {/* Lịch sử hoạt động gần đây */}
                  <div className="bg-[#1A1A1A] rounded-2xl p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-[#ADAAAA]" />
                      Hoạt động gần đây
                    </h3>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#2A2A2A] before:to-transparent">
                      {member.recentActivities.map((activity, index) => (
                        <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-[#1A1A1A] bg-[#ADAAAA] text-[#1A1A1A] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow"></div>
                          <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl bg-[#252525] border border-[#2A2A2A]">
                            <p className="font-medium text-sm">{activity.action}</p>
                            <p className="text-xs text-[#ADAAAA] mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}