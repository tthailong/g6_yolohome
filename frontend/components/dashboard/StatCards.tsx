"use client";

import { useEffect, useState } from "react";
import { dashboardService, SensorSummary } from "@/lib/api/dashboard";
import { WebSocketClient } from "@/lib/api/socket";
import { useDevices } from "@/app/context/DeviceContext";
import api from "@/lib/api/client";

const getSensorStatus = (updatedAt?: string | null) => {
  if (!updatedAt) return { label: "Offline", color: "#FF5252", isStale: true };
  const lastUpdate = new Date(updatedAt).getTime();
  const now = new Date().getTime();
  const diffMs = now - lastUpdate;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins <= 5) {
    return { label: "Online", color: "#FDD34D", isStale: false };
  } else if (diffMins < 60) {
    return { label: `Offline (${diffMins}m ago)`, color: "#FF5252", isStale: true };
  } else if (diffMins < 1440) {
    const hours = Math.floor(diffMins / 60);
    return { label: `Offline (${hours}h ago)`, color: "#FF5252", isStale: true };
  } else {
    const days = Math.floor(diffMins / 1440);
    return { label: `Offline (${days}d ago)`, color: "#FF5252", isStale: true };
  }
};

function TemperatureCard({ value, updatedAt }: { value: string | number; updatedAt?: string | null }) {
  const status = getSensorStatus(updatedAt);
  return (
    <div
      className="flex flex-col gap-2 p-6 pb-8 rounded-xl overflow-hidden animate-fade-in"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      <p className="font-jakarta font-bold text-[11px] uppercase tracking-widest" style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}>
        Temperature
      </p>
      <div className="flex items-end gap-1 relative h-14">
        <span className="font-manrope font-extrabold text-5xl text-white leading-none">{value}</span>
        <span className="font-manrope font-bold text-2xl pb-1" style={{ color: "#FDD34D" }}>°C</span>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
        <span className="font-manrope font-bold text-[10px]" style={{ color: status.isStale ? "#ADAAAA" : status.color }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

function HumidityCard({ value, updatedAt }: { value: string | number; updatedAt?: string | null }) {
  const status = getSensorStatus(updatedAt);
  return (
    <div
      className="flex flex-col gap-2 p-6 pb-8 rounded-xl overflow-hidden animate-fade-in"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      <p className="font-jakarta font-bold text-[11px] uppercase tracking-widest" style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}>
        Humidity
      </p>
      <div className="flex items-end gap-1 relative h-14">
        <span className="font-manrope font-extrabold text-5xl text-white leading-none">{value}</span>
        <span className="font-manrope font-bold text-2xl pb-1" style={{ color: "#F5D1FB" }}>%</span>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: status.color }} />
        <span className="font-manrope font-bold text-[10px]" style={{ color: status.isStale ? "#ADAAAA" : status.color }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}

function MembersCard({ members, cameraLogs }: { members: any[]; cameraLogs: any[] }) {
  const now = new Date().getTime();
  const activeMemberNames = new Set<string>();

  cameraLogs.forEach(log => {
    const logTime = new Date(log.created_at).getTime();
    const diffHours = (now - logTime) / (1000 * 60 * 60);
    
    // Member is active if recognized in the last 12 hours
    if (diffHours < 12) {
      const name = log.person_name?.trim().toLowerCase();
      if (name && name !== "stranger" && name !== "background") {
        activeMemberNames.add(name);
      }
    }
  });

  const activeMembers = members.filter(m => {
    const nameLower = (m.name || m.username || "").trim().toLowerCase();
    return activeMemberNames.has(nameLower);
  });

  const activeCount = activeMembers.length;

  return (
    <div
      className="flex flex-col gap-2 p-6 rounded-xl overflow-hidden animate-fade-in"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      <p className="font-jakarta font-bold text-[11px] uppercase tracking-widest" style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}>
        Current Members
      </p>
      <div className="flex items-end gap-2 h-14">
        <span className="font-manrope font-extrabold text-5xl text-white leading-none">
          {activeCount}
        </span>
        <span className="font-manrope font-bold text-2xl pb-1" style={{ color: "#ADAAAA" }}>active</span>
      </div>
      <div className="flex items-center pt-1 -space-x-1.5 overflow-hidden">
        {activeMembers.slice(0, 3).map((member, idx) => {
          const initials = (member.name || member.username || "U")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
          return (
            <div
              key={member.id || idx}
              className="w-6 h-6 rounded-full bg-[#262626] border border-[#484847] flex items-center justify-center text-white text-[8px] font-bold font-manrope flex-shrink-0"
              title={`${member.name} (Active)`}
            >
              {initials}
            </div>
          );
        })}
        {activeCount > 3 && (
          <div
            className="w-6 h-6 flex items-center justify-center rounded-full bg-[#262626] border border-[#484847] flex-shrink-0"
          >
            <span className="font-manrope font-bold text-[8px] text-white">+{activeCount - 3}</span>
          </div>
        )}
        {activeCount === 0 && (
          <span className="text-[10px] text-[#ADAAAA] italic">No members detected recently</span>
        )}
      </div>
    </div>
  );
}

export default function StatCards() {
  const { selectedHomeId } = useDevices();
  const [data, setData] = useState<SensorSummary[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [cameraLogs, setCameraLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedHomeId) return;

    const fetchData = async () => {
      try {
        const summary = await dashboardService.getSummary(selectedHomeId);
        setData(summary);

        try {
          const membersRes = await api.get(`/homes/${selectedHomeId}/members`);
          setMembers(membersRes.data);
        } catch (err) {
          console.error("Failed to fetch home members:", err);
        }

        try {
          const cameraLogsRes = await api.get("/devices/camera/logs");
          setCameraLogs(cameraLogsRes.data);
        } catch (err) {
          console.error("Failed to fetch camera logs:", err);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Setup WebSocket for real-time updates
    const ws = new WebSocketClient(selectedHomeId, (message) => {
      if (message.type === "SENSOR_UPDATE") {
        setData(prevData => prevData.map(sensor => {
          if (sensor.feed_name === message.feed_name) {
             return { 
               ...sensor, 
               last_value: message.value,
               updated_at: new Date().toISOString()
             };
          }
          return sensor;
        }));
      } else if (message.type === "CAMERA_UPDATE") {
        setCameraLogs(prev => [
          {
            person_name: message.person_name,
            url: message.url,
            created_at: message.created_at
          },
          ...prev
        ]);
      }
    });

    ws.connect();

    return () => ws.disconnect();
  }, [selectedHomeId]);

  const tempSensor = data.find(s => s.sensor_type === 'temperature');
  const humidSensor = data.find(s => s.sensor_type === 'humidity');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
      <TemperatureCard value={tempSensor?.last_value || "--"} updatedAt={tempSensor?.updated_at} />
      <HumidityCard value={humidSensor?.last_value || "--"} updatedAt={humidSensor?.updated_at} />
      <MembersCard members={members} cameraLogs={cameraLogs} />
    </div>
  );
}
