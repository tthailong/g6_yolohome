"use client"

import { useContext, useEffect, useState } from "react";
import AuthContext from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { Home as HomeIcon, PlusCircle, Building2, MapPin } from "lucide-react";
import { homeService, Home } from "@/lib/api/homes";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function HomesPage() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();
  const [homes, setHomes] = useState<Home[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const data = await homeService.getHomes();
        setHomes(data);
      } catch (error) {
        console.error("Failed to load homes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomes();
  }, []);

  const handleSelectHome = (homeId: number) => {
    // Navigate to dashboard which handles the selected home context
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0E0E0E] to-[#111111] text-white font-sans overflow-hidden relative">
        
        {/* Luminous Glow Effects */}
        <div className="absolute top-[-200px] left-[10%] w-[500px] h-[400px] bg-[#FDD34D]/[0.05] blur-[60px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[10%] w-[380px] h-[300px] bg-[#F5D1FB]/[0.05] blur-[50px] rounded-full pointer-events-none" />

        <div className="w-full flex justify-between items-center px-16 pt-16 z-10 relative">
          <h1 className="text-[#FDD34D] font-serif text-[24px] font-bold tracking-[-0.6px]">Luminous Sanctuary</h1>
          <div className="w-8 h-8 rounded-full border border-[#484847]/50 flex items-center justify-center text-[#ADAAAA] bg-[#1a1a1a]">
             <span className="material-symbols-outlined text-[16px]">person</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full px-6 flex-1 flex flex-col justify-center pt-8 pb-24 z-10 relative">

          <div className="mb-16 flex flex-col items-start gap-4">
             <button onClick={logout} className="px-6 py-2 rounded-full bg-[#FDD34D] hover:bg-[#ffe58f] text-[#5C4900] text-xs font-bold tracking-[0.6px] uppercase shadow-[0_10px_15px_-3px_rgba(253,211,77,0.1)] transition-colors cursor-pointer border-none focus:outline-none">
                 SIGN OUT
             </button>
             <div className="mt-8 self-center text-center">
               <h2 className="font-serif text-5xl font-extrabold tracking-[-2.4px] mb-4 text-white">Welcome back.</h2>
               <p className="text-[#ADAAAA] text-sm uppercase tracking-[2.8px]">Select an active sanctuary to manage</p>
             </div>
          </div>

          {!loading && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Home Card 1 - Obsidian Heights */}
                <button onClick={() => handleSelectHome(1)} className="group h-[247px] p-8 flex flex-col justify-between items-start rounded-xl border border-[#484847] bg-[#131313] hover:bg-[#1a1a1a] hover:border-[#FDD34D]/50 transition-all cursor-pointer text-left w-full focus:outline-none focus:ring-1 focus:ring-[#FDD34D]">
                   <div className="w-full">
                     <div className="flex justify-between w-full mb-3">
                        <MapPin className="text-[#FDD34D] w-6 h-6" />
                        <div className="px-3 py-1 rounded-full bg-[#FDD34D]/10 text-[#FDD34D] text-[10px] font-bold tracking-[1px] uppercase">
                            Active
                        </div>
                     </div>
                     <h3 className="font-serif text-2xl font-bold mb-1 mt-4">Obsidian Heights</h3>
                     <p className="text-[#ADAAAA] text-sm font-serif">Primary Residence</p>
                   </div>
                   <div className="w-full pt-4 border-t border-[#484847]/30 flex justify-between items-center group-hover:border-[#484847]/50 transition-colors">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#FDD34D]"></div>
                       <span className="text-[#ADAAAA] text-xs">All systems normal</span>
                     </div>
                     
                   </div>
                </button>

                {/* Home Card 2 - Crystal Lake */}
                <button onClick={() => handleSelectHome(2)} className="group h-[247px] p-8 flex flex-col justify-between items-start rounded-xl border border-[#484847] bg-[#131313] hover:bg-[#1a1a1a] transition-all cursor-pointer text-left w-full focus:outline-none focus:ring-1 focus:ring-[#FDD34D]">
                   <div className="w-full">
                     <div className="flex justify-between w-full mb-3">
                        <HomeIcon className="text-[#ADAAAA] w-6 h-6 group-hover:text-white transition-colors" />
                        <div className="px-3 py-1 rounded-full bg-[#FF7351]/10 text-[#FF7351] text-[10px] font-bold tracking-[1px] uppercase">
                            Alert
                        </div>
                     </div>
                     <h3 className="font-serif text-2xl font-bold mb-1 mt-4">Crystal Lake</h3>
                     <p className="text-[#ADAAAA] text-sm font-serif">Vacation Retreat</p>
                   </div>
                   <div className="w-full pt-4 border-t border-[#484847]/30 flex justify-between items-center group-hover:border-[#484847]/50 transition-colors">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#FF7351]"></div>
                       <span className="text-[#FF7351] text-xs">3 security alerts</span>
                     </div>
                   </div>
                </button>

                 {/* Home Card 3 - Neon Lofts */}
                <button onClick={() => handleSelectHome(3)} className="group h-[247px] p-8 flex flex-col justify-between items-start rounded-xl border border-[#484847] bg-[#131313] hover:bg-[#1a1a1a] transition-all cursor-pointer text-left w-full focus:outline-none focus:ring-1 focus:ring-[#FDD34D]">
                   <div className="w-full">
                     <div className="flex justify-between w-full mb-3">
                        <Building2 className="text-[#ADAAAA] w-6 h-6 group-hover:text-white transition-colors" />
                     </div>
                     <h3 className="font-serif text-2xl font-bold mb-1 mt-4">Neon Lofts</h3>
                     <p className="text-[#ADAAAA] text-sm font-serif">Urban Studio</p>
                   </div>
                   <div className="w-full pt-4 border-t border-[#484847]/30 flex justify-between items-center group-hover:border-[#484847]/50 transition-colors">
                     <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-[#EBFFE7]"></div>
                       <span className="text-[#ADAAAA] text-xs">All systems normal</span>
                     </div>
                    </div>
                </button>

                {/* Create New Sanctuary */}
                <button onClick={() => router.push('/homes/create')} className="group h-[247px] p-8 flex flex-col justify-center items-center rounded-[20px] border border-dashed border-[#484847] bg-transparent hover:bg-[#131313]/50 transition-all cursor-pointer text-center w-full focus:outline-none focus:ring-1 focus:ring-[#FDD34D]">
                   <div className="w-[56px] h-[56px] rounded-full bg-[#201F1F] flex items-center justify-center mb-6 group-hover:bg-[#2A2A2A] transition-colors border border-[#484847]/30">
                       <PlusCircle className="text-[#ADAAAA] w-6 h-6 group-hover:text-white transition-colors" />
                   </div>
                   <h3 className="font-serif text-xl font-bold mb-2">Create New Sanctuary</h3>
                   <p className="text-[#ADAAAA] text-sm">Configure a new smart environment</p>
                </button>

             </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
