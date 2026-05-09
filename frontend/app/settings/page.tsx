"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/lib/api/auth";

export default function SettingsPage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, message: "", error: false });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getMe();
        setUserProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordStatus({ loading: false, message: "New passwords do not match!", error: true });
      return;
    }
    
    setPasswordStatus({ loading: true, message: "Updating...", error: false });
    try {
      await authService.changePassword({
        old_password: passwords.old,
        new_password: passwords.new
      });
      setPasswordStatus({ loading: false, message: "Password updated successfully!", error: false });
      setPasswords({ old: "", new: "", confirm: "" });
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || "Update failed!";
      setPasswordStatus({ loading: false, message: errorMsg, error: true });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
            <div className="max-w-3xl mx-auto space-y-8 pb-12">
              
              <h1 className="text-3xl font-bold">Settings</h1>

              {loading ? (
                <div className="flex items-center justify-center p-12">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDD34D]"></div>
                </div>
              ) : (
                <>
                  <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-6 border border-[#2A2A2A]">
                    <h2 className="text-xl font-semibold border-b border-[#2A2A2A] pb-4">Personal Profile</h2>
                    
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-[#262626] border border-[#484847] flex items-center justify-center text-3xl font-bold text-[#FDD34D]">
                        {getInitials(userProfile?.username || "")}
                      </div>
                      <Button variant="outline" className="border-[#FDD34D] text-[#FDD34D] hover:bg-[#FDD34D] hover:text-[#5C4900]">
                        Change Avatar
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-2">
                        <label className="text-sm text-[#ADAAAA]">Username</label>
                        <Input className="bg-[#0E0E0E] border-[#2A2A2A] text-white" defaultValue={userProfile?.username} readOnly />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-[#ADAAAA]">Email</label>
                        <Input className="bg-[#0E0E0E] border-[#2A2A2A] text-white" defaultValue={userProfile?.email} disabled />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-[#ADAAAA]">Phone Number</label>
                        <Input className="bg-[#0E0E0E] border-[#2A2A2A] text-white" defaultValue={userProfile?.phone} placeholder="+84..." />
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-6 border border-[#2A2A2A]">
                    <h2 className="text-xl font-semibold border-b border-[#2A2A2A] pb-4">Security</h2>
                    
                    {!showPasswordForm ? (
                      <Button 
                        onClick={() => setShowPasswordForm(true)}
                        className="bg-[#262626] text-white hover:bg-[#333333] border border-[#484847]"
                      >
                        Change Password
                      </Button>
                    ) : (
                      <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                        <div className="space-y-2">
                          <label className="text-xs text-[#ADAAAA] uppercase tracking-wider font-bold">Old Password</label>
                          <Input 
                            type="password" 
                            className="bg-[#0E0E0E] border-[#2A2A2A] text-white"
                            value={passwords.old}
                            onChange={e => setPasswords({...passwords, old: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-[#ADAAAA] uppercase tracking-wider font-bold">New Password</label>
                          <Input 
                            type="password" 
                            className="bg-[#0E0E0E] border-[#2A2A2A] text-white"
                            value={passwords.new}
                            onChange={e => setPasswords({...passwords, new: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-[#ADAAAA] uppercase tracking-wider font-bold">Confirm New Password</label>
                          <Input 
                            type="password" 
                            className="bg-[#0E0E0E] border-[#2A2A2A] text-white"
                            value={passwords.confirm}
                            onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                            required
                          />
                        </div>
                        
                        {passwordStatus.message && (
                          <p className={`text-sm ${passwordStatus.error ? 'text-red-400' : 'text-green-400'}`}>
                            {passwordStatus.message}
                          </p>
                        )}

                        <div className="flex gap-3 pt-2">
                          <Button 
                            type="submit" 
                            disabled={passwordStatus.loading}
                            className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold"
                          >
                            Update
                          </Button>
                          <Button 
                            type="button"
                            onClick={() => {
                              setShowPasswordForm(false);
                              setPasswordStatus({ loading: false, message: "", error: false });
                            }}
                            variant="ghost" 
                            className="text-[#ADAAAA] hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>

                  <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-6 border border-[#2A2A2A]">
                    <h2 className="text-xl font-semibold border-b border-[#2A2A2A] pb-4">Display & Notifications</h2>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Device Notifications</h3>
                        <p className="text-sm text-[#ADAAAA]">Send alerts to phone for status changes (Door, Smoke...)</p>
                      </div>
                      <div className="w-12 h-6 bg-[#FDD34D] rounded-full relative cursor-pointer">
                        <div className="w-4 h-4 bg-[#5C4900] rounded-full absolute right-1 top-1"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button variant="ghost" className="text-[#ADAAAA] hover:text-white">Cancel</Button>
                    <Button className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold">Save Changes</Button>
                  </div>
                </>
              )}

            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
