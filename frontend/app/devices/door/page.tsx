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

  // Teachable Machine states & refs
  const [detectedName, setDetectedName] = useState<string | null>(null);
  const [detectionConfidence, setDetectionConfidence] = useState<number>(0);
  const [model, setModel] = useState<any>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const lastRecognizedNameRef = useRef<string | null>(null);
  const lastSentTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Dynamic Access Log list
  const [logs, setLogs] = useState([
    {
      id: 1,
      type: "alert",
      title: "Unknown access attempt",
      file: "UNKNOWN_ALERT.jpg",
      time: "14:45",
      detail: "ENTRYWAY CAM"
    },
    {
      id: 2,
      type: "auth",
      title: "Door unlocked by Michael",
      file: "MICHAEL_AUTH.jpg",
      time: "12:30",
      detail: "VERIFIED PIN"
    },
    {
      id: 3,
      type: "system",
      title: "Auto-lock engaged",
      file: "SYSTEM EVENT_092.log",
      time: "09:15",
      detail: "TIMER EXPIRY"
    },
    {
      id: 4,
      type: "auth",
      title: "Door unlocked by Sarah",
      file: "SARAH_AUTH.jpg",
      time: "08:45",
      detail: "FACEID VERIFIED"
    }
  ]);

  // Load Teachable Machine scripts dynamically
  useEffect(() => {
    const loadScripts = async () => {
      if ((window as any).tf && (window as any).tmImage) {
        await loadTeachableModel();
        return;
      }

      const tfScript = document.createElement("script");
      tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js";
      tfScript.async = true;
      document.body.appendChild(tfScript);

      tfScript.onload = () => {
        const tmScript = document.createElement("script");
        tmScript.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js";
        tmScript.async = true;
        document.body.appendChild(tmScript);

        tmScript.onload = async () => {
          console.log("Teachable Machine libraries loaded successfully");
          await loadTeachableModel();
        };
      };
    };

    loadScripts();
  }, []);

  const loadTeachableModel = async () => {
    if (model) return;
    setIsModelLoading(true);
    try {
      const modelURL = "https://teachablemachine.withgoogle.com/models/NmP3ZyqqY/";
      const checkpointURL = modelURL + "model.json";
      const metadataURL = modelURL + "metadata.json";
      const loadedModel = await (window as any).tmImage.load(checkpointURL, metadataURL);
      setModel(loadedModel);
      console.log("Teachable Machine model loaded successfully");
    } catch (err) {
      console.error("Failed to load Teachable Machine model:", err);
    } finally {
      setIsModelLoading(false);
    }
  };

  // Run real-time face detection loop
  useEffect(() => {
    let active = true;

    const runDetection = async () => {
      if (!active) return;
      if (isCameraActive && model && videoRef.current) {
        try {
          const predictions = await model.predict(videoRef.current);
          
          let maxProb = 0;
          let bestClass = "";
          
          predictions.forEach((p: any) => {
            if (p.probability > maxProb) {
              maxProb = p.probability;
              bestClass = p.className;
            }
          });

          if (maxProb > 0.85) { // 85% confidence threshold
            setDetectedName(bestClass);
            setDetectionConfidence(Math.round(maxProb * 100));

            const now = Date.now();
            const timeSinceLastSend = now - lastSentTimeRef.current;
            const isNewPerson = bestClass !== lastRecognizedNameRef.current;

            if (isNewPerson || timeSinceLastSend > 10000) { // 10 seconds cooldown to avoid spamming
              lastRecognizedNameRef.current = bestClass;
              lastSentTimeRef.current = now;

              // Prepend dynamic event to access logs
              const newLog = {
                id: Date.now(),
                type: "auth",
                title: `Face recognized: ${bestClass}`,
                file: `${bestClass.toUpperCase()}_LIVE.jpg`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                detail: "TEACHABLE CAM"
              };
              setLogs(prev => [newLog, ...prev]);

              // Send recognized person to Adafruit dadn.face-detect
              await updateDeviceState("dadn.face-detect", bestClass);
            }
          } else {
            setDetectedName(null);
            setDetectionConfidence(0);
          }
        } catch (err) {
          console.error("Teachable prediction error:", err);
        }
      }

      if (active && isCameraActive) {
        animationFrameRef.current = requestAnimationFrame(runDetection);
      }
    };

    if (isCameraActive && model) {
      animationFrameRef.current = requestAnimationFrame(runDetection);
    } else {
      setDetectedName(null);
      setDetectionConfidence(0);
    }

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isCameraActive, model]);

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

  // Filter logs by search query
  const filteredLogs = logs.filter(log => 
    log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.detail.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                    
                    {/* Pulsing detection indicator overlay */}
                    {detectedName && (
                      <div className="absolute inset-4 border-2 border-green-500/50 rounded-lg pointer-events-none animate-pulse flex flex-col items-center justify-between p-6 z-20">
                        {/* Corner Brackets */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400" />

                        {/* Top Detection HUD */}
                        <div className="bg-black/85 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-green-500/30 text-green-400 animate-bounce">
                          <UserCheck className="w-5 h-5 text-green-400" />
                          <span className="font-mono text-sm tracking-wider font-bold uppercase">
                            FACE RECOGNIZED: {detectedName}
                          </span>
                        </div>

                        {/* Bottom Confidence Level */}
                        <div className="bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-green-500/20 text-xs font-mono text-green-300">
                          CONFIDENCE: {detectionConfidence}%
                        </div>
                      </div>
                    )}

                    {!detectedName && (
                      <div className="absolute inset-4 border border-blue-500/20 rounded-lg pointer-events-none flex flex-col items-center justify-between p-6 z-20">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/30" />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/30" />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/30" />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/30" />

                        <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-blue-500/20 text-blue-400 font-mono text-xs animate-pulse">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                          SCANNING ACTIVE...
                        </div>
                      </div>
                    )}
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
                      disabled={isModelLoading}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {isModelLoading ? "Loading Face AI..." : "Activate Live Feed"}
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
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex gap-4">
                    <div className={`mt-1 p-2 rounded-full h-fit ${
                      log.type === "alert" 
                        ? "bg-red-500/20 text-red-500" 
                        : log.type === "auth" 
                        ? "bg-green-500/20 text-green-500"
                        : "bg-blue-500/20 text-blue-500"
                    }`}>
                      {log.type === "alert" ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : log.type === "auth" ? (
                        <UserCheck className="w-5 h-5" />
                      ) : (
                        <Settings className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{log.title}</h4>
                      <p className="text-xs text-[#ADAAAA] mt-1">{log.file}</p>
                      <div className="flex items-center text-xs text-[#5E5E5E] mt-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {log.time} • {log.detail}
                      </div>
                    </div>
                  </div>
                ))}
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