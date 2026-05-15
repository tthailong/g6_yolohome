"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, ShieldCheck, Mail, Zap, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddMemberPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("member");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/members");
    }, 1500);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0E0E0E] text-white font-sans overflow-y-auto">
        {/* Luminous Glow Effects */}
        <div className="fixed top-[-200px] left-[10%] w-[500px] h-[400px] bg-[#FDD34D]/[0.05] blur-[60px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto w-full px-6 py-12 md:py-24 z-10 relative">
          
          <div className="flex items-center gap-4 mb-12">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Invite Member</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#131313] border border-[#484847] rounded-2xl p-6 md:p-10 space-y-10 shadow-2xl">
            
            {/* Identity */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-[#484847]/30 pb-3 font-serif">
                <User className="w-5 h-5 text-[#FDD34D]" />
                Identity Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Full Name</label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Thorne"
                    className="bg-[#0E0E0E] border-[#484847] text-white py-6 focus:border-[#FDD34D] transition-colors"
                    required
                  />
                </div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['admin', 'member', 'guest'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      role === r 
                        ? 'bg-[#FDD34D]/10 border-[#FDD34D] text-white' 
                        : 'bg-[#0E0E0E] border-[#484847] text-[#ADAAAA] hover:border-[#ADAAAA]'
                    }`}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest mb-1">{r}</p>
                    <p className="text-[10px] leading-tight opacity-70">
                      {r === 'admin' ? 'Full control & user management' : 
                       r === 'member' ? 'Device control, no user management' : 
                       'Time-bound device access only'}
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