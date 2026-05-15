"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home as HomeIcon, Key, Server, Zap, Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { homeService } from "@/lib/api/homes";

export default function CreateHome() {
  const router = useRouter();
  const [homeName, setHomeName] = useState("");
  const [aioKey, setAioKey] = useState("");
  const [aioUser, setAioUser] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await homeService.createHome({
        name: homeName,
        adafruitiokey: aioKey,
        adafruitiouser: aioUser
      });
      router.push("/homes");
    } catch (error) {
      console.error("Failed to create sanctuary:", error);
      alert("Failed to create sanctuary. Please check your connection.");
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
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Create Sanctuary</h1>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#131313] border border-[#484847] rounded-2xl p-6 md:p-10 space-y-10 shadow-2xl">
            
            {/* General Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-[#484847]/30 pb-3 font-serif">
                <HomeIcon className="w-5 h-5 text-[#FDD34D]" />
                General Information
              </h2>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Sanctuary Name</label>
                <Input 
                  value={homeName}
                  onChange={(e) => setHomeName(e.target.value)}
                  placeholder="e.g. Obsidian Heights"
                  className="bg-[#0E0E0E] border-[#484847] text-white py-6 focus:border-[#FDD34D] transition-colors"
                  required
                />
              </div>
            </div>

            {/* Server Config */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-[#484847]/30 pb-3 mt-8 font-serif">
                <Server className="w-5 h-5 text-[#FDD34D]" />
                Server Configuration (Adafruit IO)
              </h2>
              <p className="text-sm text-[#ADAAAA] leading-relaxed">
                Provide your MQTT credentials to connect your new sanctuary to the cloud.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Adafruit Username</label>
                <Input 
                  value={aioUser}
                  onChange={(e) => setAioUser(e.target.value)}
                  placeholder="Your username" 
                  className="bg-[#0E0E0E] border-[#484847] text-white py-6 focus:border-[#FDD34D] transition-colors"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Adafruit IO Key</label>
                <div className="relative">
                  <Input 
                    type="password"
                    value={aioKey}
                    onChange={(e) => setAioKey(e.target.value)}
                    placeholder="aio_..." 
                    className="bg-[#0E0E0E] border-[#484847] text-white py-6 pr-12 focus:border-[#FDD34D] transition-colors"
                    required
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADAAAA] w-5 h-5" />
                </div>
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
                Initialize Sanctuary
              </Button>
            </div>

          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
