"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { WebSocketClient } from "@/lib/api/socket";

type AlertType = "fire" | "earthquake" | "none";

interface AlertContextType {
  activeAlert: { type: AlertType; message?: string };
  showAlert: (type: AlertType, message?: string) => void;
  dismissAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [activeAlert, setActiveAlert] = useState<{ type: AlertType; message?: string }>({
    type: "none"
  });

  useEffect(() => {
    // Global WebSocket Listener for High-Priority Alerts
    // Assuming Home ID 1
    const ws = new WebSocketClient(1, (message) => {
      if (message.type === "SENSOR_UPDATE") {
        if (message.feed_name === "dadn.fire-detected" && message.value !== "0" && message.value !== "") {
          setActiveAlert({ type: "fire", message: "Flame detected in your home! Buzzer active." });
        } else if (message.feed_name === "dadn.earthquake-detected" && message.value !== "0" && message.value !== "") {
          setActiveAlert({ type: "earthquake", message: "Seismic vibrations detected! Please seek shelter." });
        } else if (message.value === "0") {
          // Auto-clear alert if sensor value goes back to 0
          setActiveAlert(prev => {
            const hazardType = message.feed_name.includes("fire") ? "fire" : 
                               message.feed_name.includes("earthquake") ? "earthquake" : "none";
            if (prev.type === hazardType) return { type: "none" };
            return prev;
          });
        }
      }
    });

    ws.connect();
    return () => ws.disconnect();
  }, []);

  const showAlert = (type: AlertType, message?: string) => setActiveAlert({ type, message });
  const dismissAlert = () => setActiveAlert({ type: "none" });

  return (
    <AlertContext.Provider value={{ activeAlert, showAlert, dismissAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
}
