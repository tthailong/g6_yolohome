"use client";

import { useEffect, useState } from "react";
import { dashboardService, SensorSummary } from "@/lib/api/dashboard";
import { WebSocketClient } from "@/lib/api/socket";

function TemperatureCard({ value }: { value: string | number }) {
  return (
    <div
      className="flex flex-col gap-2 p-6 pb-8 rounded-xl overflow-hidden"
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
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.7 6L0 5.3L3.7 1.575L5.7 3.575L8.3 1H7V0H10V3H9V1.7L5.7 5L3.7 3L0.7 6Z" fill="#FDD34D" />
        </svg>
        <span className="font-manrope font-bold text-[10px]" style={{ color: "#ADAAAA" }}>
          Live Reading
        </span>
      </div>
    </div>
  );
}

function HumidityCard({ value }: { value: string | number }) {
  return (
    <div
      className="flex flex-col gap-2 p-6 pb-8 rounded-xl overflow-hidden"
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
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.3 7.3L7.825 3.775L7.125 3.075L4.3 5.9L2.875 4.475L2.175 5.175L4.3 7.3ZM5 10C4.30833 10 3.65833 9.86875 3.05 9.60625C2.44167 9.34375 1.9125 8.9875 1.4625 8.5375C1.0125 8.0875 0.65625 7.55833 0.39375 6.95C0.13125 6.34167 0 5.69167 0 5C0 4.30833 0.13125 3.65833 0.39375 3.05C0.65625 2.44167 1.0125 1.9125 1.4625 1.4625C1.9125 1.0125 2.44167 0.65625 3.05 0.39375C3.65833 0.13125 4.30833 0 5 0C5.69167 0 6.34167 0.13125 6.95 0.39375C7.55833 0.65625 8.0875 1.0125 8.5375 1.4625C8.9875 1.9125 9.34375 2.44167 9.60625 3.05C9.86875 3.65833 10 4.30833 10 5C10 5.69167 9.86875 6.34167 9.60625 6.95C9.34375 7.55833 8.9875 8.0875 8.5375 8.5375C8.0875 8.9875 7.55833 9.34375 6.95 9.60625C6.34167 9.86875 5.69167 10 5 10ZM5 9C6.11667 9 7.0625 8.6125 7.8375 7.8375C8.6125 7.0625 9 6.11667 9 5C9 3.88333 8.6125 2.9375 7.8375 2.1625C7.0625 1.3875 6.11667 1 5 1C3.88333 1 2.9375 1.3875 2.1625 2.1625C1.3875 2.9375 1 3.88333 1 5C1 6.11667 1.3875 7.0625 2.1625 7.8375C2.9375 8.6125 3.88333 9 5 9Z" fill="#F5D1FB" />
        </svg>
        <span className="font-manrope font-bold text-[10px]" style={{ color: "#F5D1FB" }}>
          Live Humidity
        </span>
      </div>
    </div>
  );
}

function MembersCard() {
  return (
    <div
      className="flex flex-col gap-2 p-6 rounded-xl overflow-hidden"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      <p className="font-jakarta font-bold text-[11px] uppercase tracking-widest" style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}>
        Current Members
      </p>
      <div className="flex items-end gap-2 h-14">
        <span className="font-manrope font-extrabold text-5xl text-white leading-none">5</span>
        <span className="font-manrope font-bold text-2xl pb-1" style={{ color: "#ADAAAA" }}>active</span>
      </div>
      <div className="flex items-center pt-1" style={{ gap: "-4px" }}>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/992b15a84072046ffa64a851d688cbe2fdbe1a78?width=48"
          alt="Member"
          className="w-6 h-6 rounded-sm object-cover flex-shrink-0"
          style={{ border: "1px solid #484847" }}
        />
        <div
          className="w-6 h-6 flex items-center justify-center rounded-sm -ml-1 flex-shrink-0"
          style={{ background: "#262626", border: "1px solid #484847" }}
        >
          <span className="font-manrope font-bold text-[8px] text-white">+2</span>
        </div>
      </div>
    </div>
  );
}

export default function StatCards() {
  const [data, setData] = useState<SensorSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Assuming home_id 1 for now, in a real app this would come from context/url
        const summary = await dashboardService.getSummary(1);
        setData(summary);
      } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    
    // Setup WebSocket for real-time updates
    const ws = new WebSocketClient(1, (message) => {
      if (message.type === "SENSOR_UPDATE") {
        setData(prevData => prevData.map(sensor => {
          if (sensor.sensor_type === 'temperature' && message.feed_name.includes('temp')) {
             return { ...sensor, last_value: message.value };
          }
           if (sensor.sensor_type === 'humidity' && message.feed_name.includes('humid')) {
             return { ...sensor, last_value: message.value };
          }
          // fallback if feed name matches exactly
          if (sensor.sensor_id.toString() === message.feed_name || sensor.device_name === message.feed_name) {
             return { ...sensor, last_value: message.value };
          }
          return sensor;
        }));
      }
    });

    ws.connect();

    return () => ws.disconnect();
  }, []);

  const tempSensor = data.find(s => s.sensor_type === 'temperature');
  const humidSensor = data.find(s => s.sensor_type === 'humidity');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
      <TemperatureCard value={tempSensor?.last_value || "--"} />
      <HumidityCard value={humidSensor?.last_value || "--"} />
      <MembersCard />
    </div>
  );
}
