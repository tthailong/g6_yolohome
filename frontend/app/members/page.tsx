"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2 } from "lucide-react";
import { useDevices } from "@/app/context/DeviceContext";
import AuthContext from "@/app/context/AuthContext";
import api from "@/lib/api/client";

export default function MembersPage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedHomeId } = useDevices();
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = useCallback(async () => {
    if (!selectedHomeId) return;
    try {
      setLoading(true);
      const res = await api.get(`/homes/${selectedHomeId}/members`);
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedHomeId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDeleteMember = async (userId: number) => {
    if (!selectedHomeId) return;
    try {
      await api.delete(`/homes/${selectedHomeId}/members/${userId}`);
      fetchMembers();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to remove member.");
    }
  };

  const currentUserMember = members.find(m => m.id === user?.id);
  const currentUserRole = currentUserMember?.role;

  const canDelete = (targetRole: string, targetId: number) => {
    if (targetId === user?.id) return false; // Cannot delete self
    if (currentUserRole === 'Owner') return true; // Owner can delete anyone
    if (currentUserRole === 'Manager') {
      return targetRole === 'Member'; // Manager can only delete standard Members
    }
    return false; // Member cannot delete anyone
  };

  // Filter members based on search query
  const filteredMembers = members.filter(m => 
    (m.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = members.filter(m => m.status === 'Active').length;
  const pendingCount = members.filter(m => m.status === 'Pending').length;

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
                    Manage household permissions and control who can interact with your YoloHome Sanctuary ecosystem.
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
                  {(currentUserRole === 'Owner' || currentUserRole === 'Manager') && (
                    <Link href="/members/add">
                      <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-semibold px-6 flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Member
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-10 border-b border-[#262626] pb-8">
                <div>
                  <p className="text-[10px] text-[#ADAAAA] uppercase tracking-widest font-semibold mb-1">Active Members</p>
                  <p className="text-3xl font-manrope font-bold">{String(activeCount).padStart(2, '0')}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#ADAAAA] uppercase tracking-widest font-semibold mb-1">Pending Invite</p>
                  <p className="text-3xl font-manrope font-bold text-[#ADAAAA]">{String(pendingCount).padStart(2, '0')}</p>
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
                    {loading ? (
                      <div className="text-center py-12 text-[#ADAAAA]">Loading members...</div>
                    ) : filteredMembers.map((member) => {
                      const initials = (member.name || "U")
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2);
                      return (
                        <div key={member.id} className="grid grid-cols-12 items-center p-4 hover:bg-[#1A1A1A] rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-[#262626]">
                          {/* Member Info */}
                          <div className="col-span-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#262626] flex items-center justify-center font-bold text-sm text-[#FDD34D]">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{member.name}</p>
                              <p className="text-xs text-[#ADAAAA] mt-0.5">{member.email}</p>
                            </div>
                          </div>
                          
                          {/* Role */}
                          <div className="col-span-3">
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                              member.role === 'Owner' ? 'bg-[#FDD34D] text-[#5C4900]' : 
                              member.role === 'Manager' ? 'bg-white text-black' : 
                              'bg-[#262626] text-white'
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
                                <>
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#ADAAAA]/50 animate-pulse"></div>
                                  <span className="text-sm text-[#ADAAAA]">Pending</span>
                                </>
                             )}
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 flex justify-end">
                            {canDelete(member.role, member.id) && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm(`Are you sure you want to remove ${member.name}?`)) {
                                    handleDeleteMember(member.id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {!loading && filteredMembers.length === 0 && (
                      <div className="text-center py-12 text-[#ADAAAA]">
                        No members found in this home.
                      </div>
                    )}
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
                        Owner <span className="text-[10px] text-[#ADAAAA] font-normal italic">Highest Role</span>
                      </h4>
                      <p className="text-xs text-[#ADAAAA] leading-relaxed">
                        Full control over the sanctuary. Capability to add/delete admins and members, manage all devices, modify system-wide settings, and delete the sanctuary.
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-[#262626]">
                      <h4 className="font-semibold text-white mb-2">Manager</h4>
                      <p className="text-xs text-[#ADAAAA] leading-relaxed">
                        Full device control within the household. Capability to adjust configurations, invite new members, and delete standard members, but cannot remove owners or other managers.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#262626]">
                      <h4 className="font-semibold text-white mb-2">Member</h4>
                      <p className="text-xs text-[#ADAAAA] leading-relaxed">
                        Standard device control access. Can adjust lighting, climate, and security states, but cannot add/delete devices, manage users, or modify sanctuary settings.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-[#1A1A1A] rounded-xl p-4 border border-[#262626]">
                    <p className="text-xs text-[#ADAAAA]">All role changes and invites are fully encrypted and logged.</p>
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
