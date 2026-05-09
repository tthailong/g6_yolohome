"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNav from "@/components/dashboard/TopNav";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Search, Camera, Lightbulb, Fan, Activity } from "lucide-react";

export default function AddDevicePage() {
  const [showNotifications, setShowNotifications] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>("light");

  const deviceTypes = [
    { id: "camera", name: "Camera", icon: <Camera className="w-6 h-6 mb-3" /> },
    { id: "light", name: "Light", icon: <Lightbulb className="w-6 h-6 mb-3" /> },
    { id: "sensor", name: "Sensor", icon: <Activity className="w-6 h-6 mb-3" /> },
    { id: "fan", name: "Fan", icon: <Fan className="w-6 h-6 mb-3" /> },
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
          <main className="flex-1 mt-14 p-8 overflow-y-auto flex justify-center items-start pt-12">
            <div className="w-full max-w-2xl">
              
              {/* Breadcrumb & Header */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <div className="flex items-center text-[#ADAAAA] text-sm mb-6">
                    <Link href="/devices" className="flex items-center hover:text-white transition-colors">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Devices
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-white font-medium">Add</span>
                  </div>
                  <h1 className="font-manrope font-extrabold text-3xl text-white tracking-tight mb-2">
                    Expand Your Sanctuary
                  </h1>
                  <p className="text-[#ADAAAA] text-sm leading-relaxed max-w-md">
                    Configure and integrate new smart hardware into your living space with minimalist precision.
                  </p>
                </div>
                
                {/* Searching status indicator */}
                <div className="flex items-center gap-3 bg-[#1A1A1A] border border-[#262626] rounded-full pl-3 pr-4 py-2">
                   <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FDD34D] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FDD34D]"></span>
                  </div>
                  <span className="text-xs font-semibold text-[#ADAAAA]">Scanning for active Bluetooth/Matter signals</span>
                </div>
              </div>

              {/* Form container */}
              <div className="bg-[#121212] border border-[#262626] rounded-2xl p-8">
                
                {/* Device Type grid */}
                <div className="mb-8">
                   <div className="flex justify-between items-center mb-4">
                     <label className="text-[10px] text-[#ADAAAA] uppercase tracking-widest font-bold">Device Type</label>
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#ADAAAA]" />
                        <input 
                          type="text" 
                          placeholder="SEARCH..." 
                          className="bg-transparent border-none focus:outline-none text-xs text-white pl-8 w-24"
                        />
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-4 gap-4">
                      {deviceTypes.map((type) => (
                        <div 
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`flex flex-col items-center justify-center py-6 rounded-xl cursor-pointer border transition-all ${
                            selectedType === type.id 
                              ? "bg-[#1A1A1A] border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]" 
                              : "bg-[#0E0E0E] border-[#262626] text-[#ADAAAA] hover:bg-[#1A1A1A]"
                          }`}
                        >
                          {type.icon}
                          <span className="text-xs font-semibold">{type.name}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6 mb-8">
                  {/* Device Name input */}
                  <div>
                    <label className="block text-[10px] text-[#ADAAAA] uppercase tracking-widest font-bold mb-2">Device Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Master Bedroom Chandelier" 
                      className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#484847] transition-colors"
                    />
                  </div>

                  {/* Room assignment & Protocol support */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] text-[#ADAAAA] uppercase tracking-widest font-bold mb-2">Assign to Room</label>
                      <select className="w-full bg-[#1A1A1A] border border-[#262626] rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-[#484847] appearance-none cursor-pointer">
                        <option>Living Room</option>
                        <option>Bedroom</option>
                        <option>Kitchen</option>
                      </select>
                      <button className="text-[10px] text-[#FDD34D] font-bold uppercase tracking-widest mt-2 hover:underline">
                        + Create New Room
                      </button>
                    </div>

                    <div>
                      <label className="block text-[10px] text-[#ADAAAA] uppercase tracking-widest font-bold mb-2">Protocol Support</label>
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-full text-xs font-semibold text-[#ADAAAA]">MATTER</span>
                        <span className="px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-full text-xs font-semibold text-[#ADAAAA]">BLE5.3</span>
                        <span className="px-3 py-1.5 bg-[#1A1A1A] border border-[#262626] rounded-full text-xs font-semibold text-[#ADAAAA]">WI-FI6</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end gap-4 border-t border-[#262626] pt-6">
                   <Link href="/devices">
                    <Button variant="ghost" className="text-[#ADAAAA] hover:text-white px-6">
                      Cancel
                    </Button>
                  </Link>
                  <Button className="bg-white text-black hover:bg-gray-200 rounded-full font-bold px-8">
                    Integrate Device
                  </Button>
                </div>

              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}