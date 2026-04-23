"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Key, Lock, Zap, HelpCircle } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { homeService } from "@/lib/api/homes";

export default function CreateHome() {
  const router = useRouter();
  const [homeName, setHomeName] = useState('');
  const [aioKey, setAioKey] = useState('');
  const [aioUser, setAioUser] = useState('');
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
      console.log('Sanctuary created successfully');
      router.push('/homes');
    } catch (error) {
       console.error("Failed to create sanctuary", error);
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0E0E0E] to-[#111111] py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden relative">
        
        {/* Glow Effects */}
        <div className="absolute top-[-100px] left-[20%] w-[500px] h-[400px] bg-[#FDD34D]/[0.05] blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[20%] w-[380px] h-[300px] bg-[#F5D1FB]/[0.03] blur-[50px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md z-10">
          <div className="bg-[#131313] border border-[#484847]/30 rounded-[32px] p-10 relative overflow-hidden shadow-2xl">
            <div className="mb-10 text-center">
              <h2 className="text-white font-serif text-3xl font-extrabold tracking-[-0.75px] mb-2">Create Sanctuary</h2>
              <p className="text-[#ADAAAA] text-sm leading-relaxed">
                 Configure your new automated environment with Adafruit IO integration.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[#ADAAAA] text-[10px] font-bold uppercase tracking-[1.5px]">
                  Home Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={homeName}
                    onChange={(e) => setHomeName(e.target.value)}
                    placeholder="e.g. Minimalist Loft"
                    className="w-full bg-[#000000] border border-[#484847]/50 text-white placeholder-[#6B7280] rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#ADAAAA] text-[10px] font-bold uppercase tracking-[1.5px]">
                  Adafruit IO Key
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aioKey}
                    onChange={(e) => setAioKey(e.target.value)}
                    placeholder="aio_XXXX_XXXXXXXXXXX"
                    className="w-full bg-[#000000] border border-[#484847]/50 text-white placeholder-[#6B7280] rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors pr-12"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#ADAAAA]">
                    <Key className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[#ADAAAA] text-[10px] font-bold uppercase tracking-[1.5px]">
                  Adafruit IO Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aioUser}
                    onChange={(e) => setAioUser(e.target.value)}
                    placeholder="Your Adafruit IO Username"
                    className="w-full bg-[#000000] border border-[#484847]/50  text-white placeholder-[#6B7280] rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors pr-12"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#ADAAAA]">
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-[0_10px_15px_-3px_rgba(253,211,77,0.1)] text-sm font-bold font-serif text-[#5C4900] bg-gradient-to-r from-[#FDD34D] to-[#e4b300] hover:from-[#ffe58f] hover:to-[#FDD34D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDD34D] focus:ring-offset-[#131313] transition-all cursor-pointer disabled:opacity-70"
                >
                  Create Sanctuary <Zap className="w-4 h-4 fill-[#5C4900]" />
                </button>
              </div>
            </form>

            <div className="mt-8 text-center border-t border-[#484847]/30 pt-6">
               <Link href="#" className="inline-flex items-center gap-2 text-[#ADAAAA] text-xs hover:text-white transition-colors">
                  <HelpCircle className="w-3 h-3" /> Need help connecting your devices?
               </Link>
            </div>
            
            <div className="mt-4 text-center">
               <button onClick={() => router.back()} className="text-[#ADAAAA]/70 text-xs hover:text-[#ADAAAA] underline underline-offset-4 transition-colors focus:outline-none cursor-pointer">
                  Cancel and go back
               </button>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
