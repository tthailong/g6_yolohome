"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal } from "lucide-react";

export default function MembersPage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const members = [
    { id: 1, name: "Julian Thorne", email: "julian.t@sanctuary.io", role: "ADMIN", status: "Active", initials: "JT" },
    { id: 2, name: "Elena Vance", email: "elena@vance.net", role: "USER", status: "Active", initials: "EV" },
    { id: 3, name: "Marcus Reed", email: "marcus.temp@gmail.com", role: "GUEST", status: "Access Expiring soon", initials: "MR" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 md:ml-20">
          <TopNav
            showNotifications={showNotifications}
            onToggleNotifications={() => setShowNotifications(!showNotifications)}
            selectedDate={new Date()}
            onSelectDate={() => {}}
          />
          <main className="flex-1 mt-14 p-8 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto">
              
              {/* Header */}
              <div className="flex items-center text-[#ADAAAA] text-sm mb-6">
                <span className="text-[#FDD34D] cursor-pointer hover:underline">Members</span>
              </div>
              
              <div className="flex justify-between items-start mb-10">
                <div className="max-w-md">
                  <h1 className="font-manrope font-extrabold text-3xl text-white tracking-tight uppercase mb-2">
                    Members Access
                  </h1>
                  <p className="text-[#ADAAAA] text-sm leading-relaxed">
                    Manage household permissions and control who can interact with your Luminous Sanctuary ecosystem.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADAAAA]" />
                    <input 
                      type="text" 
                      placeholder="SEARCH MEMBERS..." 
                      className="bg-[#1A1A1A] border border-[#262626] rounded-full pl-10 pr-4 py-2.5 text-xs text-white uppercase tracking-wider focus:outline-none focus:border-[#484847] w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-semibold px-6 flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Member
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-10 border-b border-[#262626] pb-8">
                <div>
                  <p className="text-[10px] text-[#ADAAAA] uppercase tracking-widest font-semibold mb-1">Active Members</p>
                  <p className="text-3xl font-manrope font-bold">03</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#ADAAAA] uppercase tracking-widest font-semibold mb-1">Pending Invite</p>
                  <p className="text-3xl font-manrope font-bold text-[#ADAAAA]">01</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Members Table Area */}
                <div className="col-span-2">
                  <div className="grid grid-cols-12 text-[10px] text-[#ADAAAA] uppercase tracking-widest font-semibold pb-4 border-b border-[#262626] mb-4">
                    <div className="col-span-5">Member</div>
                    <div className="col-span-3">Role</div>
                    <div className="col-span-3">Status</div>
                    <div className="col-span-1 text-right">Actions</div>
                  </div>

                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="grid grid-cols-12 items-center p-4 hover:bg-[#1A1A1A] rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-[#262626]">
                        {/* Member Info */}
                        <div className="col-span-5 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center font-bold text-sm">
                            {member.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{member.name}</p>
                            <p className="text-xs text-[#ADAAAA] mt-0.5">{member.email}</p>
                          </div>
                        </div>
                        
                        {/* Role */}
                        <div className="col-span-3">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                            member.role === 'ADMIN' ? 'bg-white text-black' : 
                            member.role === 'USER' ? 'bg-[#262626] text-white' : 
                            'bg-transparent border border-[#262626] text-[#ADAAAA]'
                          }`}>
                            {member.role}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="col-span-3 flex items-center gap-2">
                           {member.status === 'Active' ? (
                              <>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-sm text-[#ADAAAA]">Active</span>
                              </>
                           ) : (
                              <span className="text-sm text-[#D53D18]">{member.status}</span>
                           )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex justify-end">
                          <Button variant="ghost" size="icon" className="text-[#ADAAAA] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Role Definitions */}
                <div className="col-span-1 bg-[#121212] border border-[#262626] rounded-2xl p-6 h-fit">
                  <h3 className="text-[10px] text-[#ADAAAA] uppercase tracking-widest font-semibold mb-6 flex items-center justify-between">
                    Role Definitions
                    <span className="text-[#FDD34D]">Security Note</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-white mb-2 flex justify-between">
                        Admin <span className="text-[10px] text-[#ADAAAA] font-normal italic">Typically the first account creator.</span>
                      </h4>
                      <p className="text-xs text-[#ADAAAA] leading-relaxed">
                        Full control over the sanctuary. Capability to add or delete users, manage all devices, and modify system-wide settings.
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-[#262626]">
                      <h4 className="font-semibold text-white mb-2">User</h4>
                      <p className="text-xs text-[#ADAAAA] leading-relaxed">
                        Full device control within the household. Can adjust lighting, climate, and security states but cannot add new devices or manage other members.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#262626]">
                      <h4 className="font-semibold text-white mb-2">Guest</h4>
                      <p className="text-xs text-[#ADAAAA] leading-relaxed">
                        Time-bound access for visitors. Grants the same controls as a regular 'User' but access expires automatically after a set duration.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-[#1A1A1A] rounded-xl p-4 border border-[#262626]">
                    <p className="text-xs text-[#ADAAAA]">All role changes are logged and sent to the Admin.</p>
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
