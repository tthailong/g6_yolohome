"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import LightTopNav from "@/components/dashboard/LightTopNav";
import { 
  ChevronLeft, 
  Search, 
  Video, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  Settings,
  Shield
} from "lucide-react";
import Link from "next/link";

import { useDevices } from "@/app/context/DeviceContext";

export default function SmartDoorPage() {
  const { deviceStates, updateDeviceState } = useDevices();
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleActivateCamera = async () => {
    setIsScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      streamRef.current = stream;
      
      setTimeout(() => {
        setIsScanning(false);
        setIsCameraActive(true);
      }, 1500);
    } catch (err) {
      console.error("Webcam access denied:", err);
      setIsScanning(false);
      alert("Please allow camera access to use the Live Feed.");
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const isLocked = deviceStates["dadn.door-state"] === "1";

  const handleToggle = async (lock: boolean) => {
    try {
      const valueToSend = lock ? "1" : "0";
      await updateDeviceState("dadn.door-state", valueToSend);
    } catch (error) {
      console.error("Failed to update door state:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 md:ml-20">
        <LightTopNav 
          showNotifications={showRightPanel}
          onToggleNotifications={() => setShowRightPanel((v) => !v)}
          title="Door"
        />

        <main className="flex-1 mt-14 overflow-hidden flex flex-row">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col p-8 overflow-y-auto transition-all duration-300">

            {/* Camera Feed Section */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl overflow-hidden mb-8 relative group">
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center text-xs font-semibold text-green-400 border border-green-500/20 z-10">
                <Shield className="w-3 h-3 mr-2" />
                {isCameraActive ? "LIVE FEED" : "ENCRYPTED"}
              </div>
              
              {isCameraActive && (
                <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded flex items-center text-[10px] font-bold text-white animate-pulse z-10">
                  <div className="w-2 h-2 rounded-full bg-white mr-2" />
                  REC
                </div>
              )}
              
              <div className="h-[540px] relative flex flex-col items-center justify-center bg-gradient-to-b from-[#1A1A1A] to-[#0E0E0E]">
                {isCameraActive ? (
                  <>
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover brightness-110 contrast-110"
                    />
                    {/* Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
                  </>
                ) : isScanning ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-t-[#FDD34D] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4" />
                    <p className="text-[#FDD34D] font-mono text-sm tracking-widest animate-pulse">ESTABLISHING SECURE LINK...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-[#262626] rounded-full flex items-center justify-center mb-6">
                      <Video className="w-10 h-10 text-[#ADAAAA]" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Turn on your camera in Main door</h2>
                    <p className="text-[#ADAAAA] text-sm text-center max-w-md mb-8">
                      Security feed is currently encrypted and in standby mode.
                    </p>
                    <button 
                      onClick={handleActivateCamera}
                      className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-semibold transition-colors flex items-center"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Activate Live Feed
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Lock Status Section */}
            <div className="bg-[#121212] border border-[#262626] rounded-2xl p-8 flex items-center justify-between">
              <div>
                <p className="text-[#ADAAAA] text-xs font-bold uppercase tracking-wider mb-2">Status</p>
                <h2 className="text-3xl font-bold text-white">
                  Your door is {isLocked ? "locked" : "unlocked"}
                </h2>
              </div>
              <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-[#262626]">
                <button
                  onClick={() => handleToggle(false)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    !isLocked 
                      ? "bg-white text-black shadow-sm" 
                      : "text-[#ADAAAA] hover:text-white"
                  }`}
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Unlock
                </button>
                <button
                  onClick={() => handleToggle(true)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                    isLocked 
                      ? "bg-white text-black shadow-sm" 
                      : "text-[#ADAAAA] hover:text-white"
                  }`}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Lock
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Access Log */}
          <div
            className="flex flex-col overflow-hidden transition-all duration-300 ease-in-out shrink-0 border-l border-[#262626] bg-[#0A0A0A]"
            style={{
              width: showRightPanel ? "400px" : "0px",
              opacity: showRightPanel ? 1 : 0,
            }}
          >
            <div className="p-6 h-full flex flex-col">
              <h2 className="font-manrope font-bold text-xl text-white mb-6">Access log</h2>
              
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ADAAAA] w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="SEARCH..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#262626] text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Log List */}
              <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                
                {/* Item 1: Unknown Alert */}
                <div className="flex gap-4">
                  <div className="mt-1 bg-red-500/20 p-2 rounded-full h-fit text-red-500">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Unknown access attempt</h4>
                    <p className="text-xs text-[#ADAAAA] mt-1">2026-03-19 UNKNOWN_ALERT.jpg</p>
                    <div className="flex items-center text-xs text-[#5E5E5E] mt-2">
                      <Clock className="w-3 h-3 mr-1" />
                      14:45 • ENTRYWAY CAM
                    </div>
                  </div>
                </div>

                {/* Item 2: Michael */}
                <div className="flex gap-4">
                  <div className="mt-1 bg-blue-500/20 p-2 rounded-full h-fit text-blue-500">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Door unlocked by Michael</h4>
                    <p className="text-xs text-[#ADAAAA] mt-1">2026-03-19 MICHAEL_AUTH.jpg</p>
                    <div className="flex items-center text-xs text-[#5E5E5E] mt-2">
                      <Clock className="w-3 h-3 mr-1" />
                      12:30 • VERIFIED PIN
                    </div>
                  </div>
                </div>

                {/* Item 3: Auto-lock */}
                <div className="flex gap-4">
                  <div className="mt-1 bg-green-500/20 p-2 rounded-full h-fit text-green-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Auto-lock engaged</h4>
                    <p className="text-xs text-[#ADAAAA] mt-1">SYSTEM EVENT_092.log</p>
                    <div className="flex items-center text-xs text-[#5E5E5E] mt-2">
                      <Clock className="w-3 h-3 mr-1" />
                      09:15 • TIMER EXPIRY
                    </div>
                  </div>
                </div>

                {/* Item 4: Sarah */}
                <div className="flex gap-4">
                  <div className="mt-1 bg-purple-500/20 p-2 rounded-full h-fit text-purple-500">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Door unlocked by Sarah</h4>
                    <p className="text-xs text-[#ADAAAA] mt-1">2026-03-19_SARAH_AUTH.jpg</p>
                    <div className="flex items-center text-xs text-[#5E5E5E] mt-2">
                      <Clock className="w-3 h-3 mr-1" />
                      08:45 • FACEID VERIFIED
                    </div>
                  </div>
                </div>

                {/* Item 5: Maintenance */}
                <div className="flex gap-4 opacity-60">
                  <div className="mt-1 bg-gray-500/20 p-2 rounded-full h-fit text-gray-400">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">Maintenance Mode Disengaged</h4>
                    <p className="text-xs text-[#ADAAAA] mt-1">2026-03-18 SYSTEM_HEALTH.jpg</p>
                    <div className="flex items-center text-xs text-[#5E5E5E] mt-2">
                      <Clock className="w-3 h-3 mr-1" />
                      YESTERDAY • REMOTE
                    </div>
                  </div>
                </div>

              </div>

              <button className="w-full mt-4 py-3 border border-[#262626] text-[#ADAAAA] hover:text-white hover:bg-[#1A1A1A] rounded-xl font-medium transition-colors">
                View Full History +
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}