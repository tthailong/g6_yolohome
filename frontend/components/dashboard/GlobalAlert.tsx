"use client";

import { useAlert } from "@/app/context/AlertContext";
import EmergencyAlert from "@/components/dashboard/EmergencyAlert";

export default function GlobalAlert() {
  const { activeAlert, dismissAlert } = useAlert();
  
  if (activeAlert.type === "none") return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-4xl px-4 pointer-events-none">
      <div className="pointer-events-auto">
        <EmergencyAlert 
          type={activeAlert.type} 
          message={activeAlert.message} 
          onDismiss={dismissAlert} 
        />
      </div>
    </div>
  );
}
