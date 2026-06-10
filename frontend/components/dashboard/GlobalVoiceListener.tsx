"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useDevices } from "@/app/context/DeviceContext";

export default function GlobalVoiceListener() {
  const pathname = usePathname();
  const { updateDeviceState } = useDevices();
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    // 1. Set to false so it automatically stops after hearing one command
    recognition.continuous = false; 
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.toLowerCase().trim();
      
      setLastCommand(transcript);

      const isTurnOn = transcript.includes("turn on") || transcript.includes("open");
      const isTurnOff = transcript.includes("turn off") || transcript.includes("close");

      // 1. Fan Command
      if ((isTurnOn || isTurnOff) && (transcript.includes("fan") || transcript.includes("ceiling fan"))) {
        if (isTurnOn) {
          updateDeviceState("dadn.fan-state", "1");
          updateDeviceState("dadn.fan-speed", "50");
        } else {
          updateDeviceState("dadn.fan-state", "0");
        }
      } 
      // 2. LED / Light / Lamp Command
      else if ((isTurnOn || isTurnOff) && (transcript.includes("led") || transcript.includes("light") || transcript.includes("lamp"))) {
        updateDeviceState("dadn.led-state", isTurnOn ? "1" : "0");
      }
      // 3. Door Lock Command
      else if (transcript.includes("door") || transcript.includes("lock") || transcript.includes("gate")) {
        const isUnlock = isTurnOn || transcript.includes("unlock");
        const isLock = isTurnOff || transcript.includes("lock");
        
        if (isUnlock) {
          updateDeviceState("dadn.door-state", "0"); // 0 represents unlocked/open
        } else if (isLock) {
          updateDeviceState("dadn.door-state", "1"); // 1 represents locked/closed
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Voice recognition error:", event.error);
      setIsListening(false);
    };

    // 2. Simply update state when it finishes, do NOT auto-restart
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [updateDeviceState]);

  if (pathname === "/login") return null;

  // 3. The toggle function for the button
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (e) {
        // Prevent crash if user double-clicks rapidly
      }
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {lastCommand && (
        <div className="bg-[#1A1A1A] text-[#ADAAAA] text-xs px-3 py-1.5 rounded-lg border border-[#484847] shadow-lg animate-fade-out pointer-events-none">
          "{lastCommand}"
        </div>
      )}
      
      {/* 4. Changed from a static div to an interactive button */}
      <button
        onClick={toggleListening}
        className={`flex items-center gap-2 px-4 py-3 rounded-full border shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
          isListening 
            ? 'bg-[#2d6a4f] border-[#40916c]' 
            : 'bg-[#1A1A1A] border-[#484847] hover:bg-[#262626]'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={isListening ? "animate-pulse" : ""}>
          <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14ZM17.3 11C17.3 14 14.76 16.1 12 16.1C9.24 16.1 6.7 14 6.7 11H5C5 14.41 7.72 17.23 11 17.72V21H13V17.72C16.28 17.23 19 14.41 19 11H17.3Z" fill="white"/>
        </svg>
        <span className="text-white text-sm font-semibold font-jakarta">
          {isListening ? "Listening..." : "Tap to Speak"}
        </span>
      </button>
    </div>
  );
}