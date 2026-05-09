"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { dashboardService, SensorSummary } from "@/lib/api/dashboard";
import { WebSocketClient } from "@/lib/api/socket";
import { deviceService } from "@/lib/api/devices";

interface DeviceContextType {
  deviceStates: Record<string, any>; // feed_name -> value
  updateDeviceState: (feedName: string, value: any) => Promise<void>;
  isLoading: boolean;
  refreshStates: () => Promise<void>;
  selectedHomeId: number | null;
  selectHome: (homeId: number) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: React.ReactNode }) {
  const [deviceStates, setDeviceStates] = useState<Record<string, any>>({});
  const [selectedHomeId, setSelectedHomeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load selected home from localStorage on initial mount
  useEffect(() => {
    const savedHomeId = localStorage.getItem("selectedHomeId");
    if (savedHomeId) {
      setSelectedHomeId(parseInt(savedHomeId));
    }
  }, []);

  const selectHome = (homeId: number) => {
    setSelectedHomeId(homeId);
    localStorage.setItem("selectedHomeId", homeId.toString());
  };

  const refreshStates = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!selectedHomeId || !token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const summary = await dashboardService.getSummary(selectedHomeId);
      const newStates: Record<string, any> = {};
      summary.forEach(s => {
        newStates[s.feed_name] = s.last_value;
      });
      setDeviceStates(newStates);
    } catch (error) {
      console.error("Failed to refresh device states:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedHomeId]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!selectedHomeId || !token) return;

    refreshStates();

    const ws = new WebSocketClient(selectedHomeId, (message) => {
      if (message.type === "SENSOR_UPDATE") {
        setDeviceStates(prev => ({
          ...prev,
          [message.feed_name]: message.value
        }));
      }
    });

    ws.connect();
    return () => ws.disconnect();
  }, [selectedHomeId, refreshStates]);

  const updateDeviceState = async (feedName: string, value: any) => {
    if (!selectedHomeId) return;

    // Optimistic update
    setDeviceStates(prev => ({ ...prev, [feedName]: value }));
    
    try {
      await deviceService.control({
        home_id: selectedHomeId,
        feed_name: feedName,
        value: value.toString()
      });
    } catch (error) {
      console.error(`Failed to update device ${feedName}:`, error);
      refreshStates();
    }
  };

  return (
    <DeviceContext.Provider value={{ 
      deviceStates, 
      updateDeviceState, 
      isLoading, 
      refreshStates, 
      selectedHomeId, 
      selectHome 
    }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevices() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
}
