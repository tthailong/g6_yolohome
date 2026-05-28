"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Mail, Zap, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDevices } from "@/app/context/DeviceContext";
import AuthContext from "@/app/context/AuthContext";
import api from "@/lib/api/client";

export default function AddMemberPage() {
  const router = useRouter();
  const { selectedHomeId } = useDevices();
  const { user } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member"); // Default to Member
  const [currentUserRole, setCurrentUserRole] = useState("Member");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch current user's role in this home to determine invitation permissions
  useEffect(() => {
    const fetchCurrentRole = async () => {
      if (!selectedHomeId || !user?.id) return;
      try {
        const res = await api.get(`/homes/${selectedHomeId}/members`);
        const membersList = res.data;
        const currentMember = membersList.find((m: any) => m.id === user?.id);
        if (currentMember) {
          setCurrentUserRole(currentMember.role);
          // Auto-select the highest role they are allowed to invite
          if (currentMember.role === "Owner") {
            setRole("Manager");
          } else {
            setRole("Member");
          }
        }
      } catch (err) {
        console.error("Failed to fetch current user's role:", err);
      }
    };
    fetchCurrentRole();
  }, [selectedHomeId, user]);

  const allRoles = [
    { id: 'Owner', label: 'Owner', desc: 'Highest authority. Full sanctuary management & deletion.' },
    { id: 'Manager', label: 'Manager', desc: 'Manage devices and invite/delete standard members.' },
    { id: 'Member', label: 'Member', desc: 'Full device control access, no user management.' }
  ];

  const allowedRoles = allRoles.filter((r) => {
    if (currentUserRole === 'Owner') {
      return r.id !== 'Owner'; // Owner cannot invite another Owner
    }
    if (currentUserRole === 'Manager') {
      return r.id === 'Member'; // Manager can only invite standard Members
    }
    return r.id === 'Member'; // Standard member fallback
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHomeId) {
      setError("Please select a home first.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await api.post("/homes/invite", {
        home_id: selectedHomeId,
        email: email.trim(),
        role: role
      });
      router.push("/members");
    } catch (err: any) {
      console.error("[Invite] Failed:", err);
      setError(err.response?.data?.detail || "Failed to send invitation. Please verify the email is correct and registered.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0E0E0E] text-white font-sans overflow-y-auto">
        {/* Luminous Glow Effects */}
        <div className="fixed top-[-200px] left-[10%] w-[500px] h-[400px] bg-[#FDD34D]/[0.05] blur-[60px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto w-full px-6 py-12 md:py-24 z-10 relative">
          
          <div className="flex items-center gap-4 mb-12">
            <button 
              type="button"
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Invite Member</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#131313] border border-[#484847] rounded-2xl p-6 md:p-10 space-y-10 shadow-2xl">
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Email Address Section */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-[#484847]/30 pb-3 font-serif">
                <Mail className="w-5 h-5 text-[#FDD34D]" />
                Identity Information
              </h2>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Email Address</label>
                <div className="relative">
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="bg-[#0E0E0E] border-[#484847] text-white py-6 pr-12 focus:border-[#FDD34D] transition-colors"
                    required
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADAAAA] w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Access Permissions */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-[#484847]/30 pb-3 mt-8 font-serif">
                <ShieldCheck className="w-5 h-5 text-[#FDD34D]" />
                Access Permissions
              </h2>
              <p className="text-sm text-[#ADAAAA] leading-relaxed">
                Choose the level of control this member will have within your sanctuary ecosystem.
              </p>
              
              <div className={`grid grid-cols-1 gap-4 ${
                allowedRoles.length === 2 ? 'md:grid-cols-2' : 
                allowedRoles.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-3'
              }`}>
                {allowedRoles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === r.id 
                        ? 'bg-[#FDD34D]/10 border-[#FDD34D] text-white' 
                        : 'bg-[#0E0E0E] border-[#484847] text-[#ADAAAA] hover:border-[#ADAAAA]'
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-1">{r.label}</p>
                    <p className="text-[10px] leading-tight opacity-70">
                      {r.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex justify-end gap-4 border-t border-[#484847]/30">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-8 py-2 text-[#ADAAAA] hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
              >
                Cancel
              </button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold px-10 shadow-lg shadow-[#FDD34D]/10"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 fill-[#5C4900]" />}
                Send Invitation
              </Button>
            </div>

          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}