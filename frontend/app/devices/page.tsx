"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import DeviceCard, { AddDeviceCard } from "@/components/dashboard/DeviceCard";
import type { DeviceCardData } from "@/components/dashboard/DeviceCard";
import { WebSocketClient } from "@/lib/api/socket";
import { deviceService } from "@/lib/api/devices";

/* ── Icons ───────────────────────────────────────────────── */
const LightIcon = () => (
  <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
    <path d="M6 19V17H10V19H6ZM5 16C3.73333 15.2 2.75 14.1375 2.05 12.8125C1.35 11.4875 1 10.0667 1 8.55C1 6.15 1.825 4.1 3.475 2.4C5.125 0.7 7.125 -0.15 9.5 0C11.55 0.133333 13.2625 0.9625 14.6375 2.4875C16.0125 4.0125 16.45 5.75 16 7.7C15.6833 9.0167 15.1 10.1958 14.25 11.2375C13.4 12.2792 12.3667 13.1667 11.15 13.9L10 13.2V16H5Z" fill="currentColor"/>
  </svg>
);

const FanIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 13C12.55 13 13.0208 12.8042 13.4125 12.4125C13.8042 12.0208 14 11.55 14 11C14 10.45 13.8042 9.97917 13.4125 9.5875C13.0208 9.19583 12.55 9 12 9C11.45 9 10.9792 9.19583 10.5875 9.5875C10.1958 9.97917 10 10.45 10 11C10 11.55 10.1958 12.0208 10.5875 12.4125C10.9792 12.8042 11.45 13 12 13ZM12 24C11.1 24 10.3958 23.6417 9.8875 22.925C9.37917 22.2083 9.2 21.4167 9.35 20.55L9.9 17.5C8.83333 17.1667 7.85833 16.6667 6.975 16C6.09167 15.3333 5.35 14.5333 4.75 13.6L2 14.85C1.2 15.2167 0.391667 15.1958 -0.425 14.7875C-1.24167 14.3792 -1.75 13.7167 -1.95 12.8L-2 12C-2 11.1 -1.64167 10.3958 -0.925 9.8875C-0.208333 9.37917 0.583333 9.2 1.45 9.35L4.5 9.9C4.83333 8.83333 5.33333 7.85833 6 6.975C6.66667 6.09167 7.46667 5.35 8.4 4.75L7.15 2C6.78333 1.2 6.80417 0.391667 7.2125 -0.425C7.62083 -1.24167 8.28333 -1.75 9.2 -1.95L10 -2C10.9 -2 11.6042 -1.64167 12.1125 -0.925C12.6208 -0.208333 12.8 0.583333 12.65 1.45L12.1 4.5C13.1667 4.83333 14.1417 5.33333 15.025 6C15.9083 6.66667 16.65 7.46667 17.25 8.4L20 7.15C20.8 6.78333 21.6083 6.80417 22.425 7.2125C23.2417 7.62083 23.75 8.28333 23.95 9.2L24 10C24 10.9 23.6417 11.6042 22.925 12.1125C22.2083 12.6208 21.4167 12.8 20.55 12.65L17.5 12.1C17.1667 13.1667 16.6667 14.1417 16 15.025C15.3333 15.9083 14.5333 16.65 13.6 17.25L14.85 20C15.2167 20.8 15.1958 21.6083 14.7875 22.425C14.3792 23.2417 13.7167 23.75 12.8 23.95L12 24Z" fill="currentColor"/>
  </svg>
);

const MoodIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM8 13C8 14.1046 9.79086 15 12 15C14.2091 15 16 14.1046 16 13H8ZM8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11ZM15.5 11C16.3284 11 17 10.3284 17 9.5C17 8.67157 16.3284 8 15.5 8C14.6716 8 14 8.67157 14 9.5C14 10.3284 14.6716 11 15.5 11Z" fill="currentColor"/>
  </svg>
);

const TempIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
    <path d="M8 18C6.61667 18 5.4375 17.5125 4.4625 16.5375C3.4875 15.5625 3 14.3833 3 13C3 12.2333 3.17083 11.5208 3.5125 10.8625C3.85417 10.2042 4.33333 9.66667 4.95 9.25V3C4.95 2.16667 5.24583 1.45833 5.8375 0.875C6.42917 0.291667 7.13333 0 7.95 0C8.78333 0 9.49167 0.291667 10.075 0.875C10.6583 1.45833 10.95 2.16667 10.95 3V9.25C11.5667 9.66667 12.0458 10.2042 12.3875 10.8625C12.7292 11.5208 12.9 12.2333 12.9 13C12.9 14.3833 12.4125 15.5625 11.4375 16.5375C10.4625 17.5125 9.28333 18 7.9 18H8Z" fill="currentColor"/>
  </svg>
);

const CoffeeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M2 22V20H22V22H2ZM4 19C3.45 19 2.97917 18.8042 2.5875 18.4125C2.19583 18.0208 2 17.55 2 17V5H20V8H21C21.5667 8 22.0417 8.20417 22.425 8.6125C22.8083 9.02083 23 9.51667 23 10.1V12.9C23 13.4833 22.8083 13.9792 22.425 14.3875C22.0417 14.7958 21.5667 15 21 15H20V17C20 17.55 19.8042 18.0208 19.4125 18.4125C19.0208 18.8042 18.55 19 18 19H4ZM4 13H18V7H4V13ZM20 13H21V10H20V13Z" fill="currentColor"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 20" fill="none">
    <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V8C0 7.45 0.195833 6.97917 0.5875 6.5875C0.979167 6.19583 1.45 6 2 6H3V4C3 2.9 3.39167 1.95833 4.175 1.175C4.95833 0.391667 5.9 0 7 0H9C10.1 0 11.0417 0.391667 11.825 1.175C12.6083 1.95833 13 2.9 13 4V6H14C14.55 6 15.0208 6.19583 15.4125 6.5875C15.8042 6.97917 16 7.45 16 8V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H2ZM8 15C8.55 15 9.02083 14.8042 9.4125 14.4125C9.80417 14.0208 10 13.55 10 13C10 12.45 9.80417 11.9792 9.4125 11.5875C9.02083 11.1958 8.55 11 8 11C7.45 11 6.97917 11.1958 6.5875 11.5875C6.19583 11.9792 6 12.45 6 13C6 13.55 6.19583 14.0208 6.5875 14.4125C6.97917 14.8042 7.45 15 8 15ZM5 6H11V4C11 3.45 10.8042 2.97917 10.4125 2.5875C10.0208 2.19583 9.55 2 9 2H7C6.45 2 5.97917 2.19583 5.5875 2.5875C5.19583 2.97917 5 3.45 5 4V6Z" fill="currentColor"/>
  </svg>
);

const AirIcon = () => (
  <svg width="18" height="14" viewBox="0 0 24 18" fill="none">
    <path d="M0 18V16H14C14.8333 16 15.5417 15.7083 16.125 15.125C16.7083 14.5417 17 13.8333 17 13C17 12.1667 16.7083 11.4583 16.125 10.875C15.5417 10.2917 14.8333 10 14 10H10V8H14C15.3833 8 16.5625 8.4875 17.5375 9.4625C18.5125 10.4375 19 11.6167 19 13C19 14.3833 18.5125 15.5625 17.5375 16.5375C16.5625 17.5125 15.3833 18 14 18H0ZM0 11V9H9C9.56667 9 10.0417 8.80417 10.425 8.4125C10.8083 8.02083 11 7.55 11 7C11 6.45 10.8083 5.97917 10.425 5.5875C10.0417 5.19583 9.56667 5 9 5H0V3H9C10.1 3 11.0417 3.39167 11.825 4.175C12.6083 4.95833 13 5.9 13 7C13 8.1 12.6083 9.04167 11.825 9.825C11.0417 10.6083 10.1 11 9 11H0ZM0 4V2H19C20.1 2 21.0417 1.60833 21.825 0.825C22.6083 0.0416667 23 -0.9 23 -2C23 -3.1 22.6083 -4.04167 21.825 -4.825C21.0417 -5.60833 20.1 -6 19 -6H16V-8H19C20.6667 -8 22.0833 -7.41667 23.25 -6.25C24.4167 -5.08333 25 -3.66667 25 -2C25 -0.333333 24.4167 1.08333 23.25 2.25C22.0833 3.41667 20.6667 4 19 4H0Z" fill="currentColor"/>
  </svg>
);

const BlindsIcon = () => (
  <svg width="18" height="16" viewBox="0 0 24 20" fill="none">
    <path d="M0 2V0H24V2H0ZM4 9V7H20V9H4ZM0 5V3H24V5H0ZM4 13V11H20V13H4ZM0 17V15H24V17H0ZM4 20V18H20V20H4Z" fill="currentColor"/>
  </svg>
);

/* ── Room data ───────────────────────────────────────────── */
const INITIAL_ROOMS: { name: string; devices: (DeviceCardData & { feedName?: string; additionalFeeds?: string[] })[] }[] = [
  {
    name: "Living Room",
    devices: [
      {
        id: "d1",
        name: "Main Chandelier",
        subtitle: "80% intensity",
        status: "off",
        isActive: false,
        feedName: "dadn.led-state",
        icon: <LightIcon />,
        href: "/devices/lamp",
      },
      {
        id: "d2",
        name: "Ceiling Fan",
        subtitle: "Standby",
        status: "standby",
        icon: <FanIcon />,
      },
      {
        id: "d3",
        name: "Living Room Door",
        subtitle: "Secured",
        status: "locked",
        badge: "LOCKED",
        badgeColor: "#D53D18",
        isMood: true,
        noToggle: true,
        icon: <LockIcon />,
      },
    ],
  },
  {
    name: "Kitchen",
    devices: [
      {
        id: "d4",
        name: "Smart Temperature & Humidity Monitor",
        subtitle: "TEMP: --°C  HUM: --%",
        status: "on",
        isActive: true,
        feedName: "dadn.dht20-temperature",
        additionalFeeds: ["dadn.dht20-humidity"],
        icon: <TempIcon />,
      },
      {
        id: "d5",
        name: "Espresso Machine",
        subtitle: "Ready in 2 min",
        status: "standby",
        icon: <CoffeeIcon />,
      },
    ],
  },
  {
    name: "Bedroom & Security",
    devices: [
      {
        id: "d6",
        name: "Front Door",
        subtitle: "Secured at 10:45 PM",
        status: "locked",
        badge: "LOCKED",
        badgeColor: "#D53D18",
        isMood: true,
        noToggle: true,
        icon: <LockIcon />,
      },
      {
        id: "d7",
        name: "Air Purifier",
        subtitle: "Sleep Mode",
        status: "standby",
        icon: <AirIcon />,
      },
      {
        id: "d8",
        name: "Blackout Blinds",
        subtitle: "Closed",
        status: "off",
        icon: <BlindsIcon />,
      },
    ],
  },
];

/* ── Top Nav for Devices ─────────────────────────────────── */
function DevicesTopNav() {
  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between h-14 px-6"
      style={{
        left: "80px",
        background: "rgba(14,14,14,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(72,72,71,0.4)",
      }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
          <path d="M7.41 10.59L2.83 6L7.41 1.41L6 0L0 6L6 12L7.41 10.59Z" fill="#ADAAAA"/>
        </svg>
        <span className="font-jakarta text-sm font-semibold text-white tracking-wide">
          Devices
        </span>
      </div>

      {/* Right: Search + Bell + Avatar */}
      <div className="flex items-center gap-5">
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg w-44"
          style={{ background: "#1A1A1A" }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M12.45 13.5L7.725 8.775C7.35 9.075 6.91875 9.3125 6.43125 9.4875C5.94375 9.6625 5.425 9.75 4.875 9.75C3.5125 9.75 2.35938 9.27813 1.41562 8.33438C0.471875 7.39063 0 6.2375 0 4.875C0 3.5125 0.471875 2.35938 1.41562 1.41562C2.35938 0.471875 3.5125 0 4.875 0C6.2375 0 7.39063 0.471875 8.33438 1.41562C9.27813 2.35938 9.75 3.5125 9.75 4.875C9.75 5.425 9.6625 5.94375 9.4875 6.43125C9.3125 6.91875 9.075 7.35 8.775 7.725L13.5 12.45L12.45 13.5ZM4.875 8.25C5.8125 8.25 6.60938 7.92188 7.26562 7.26562C7.92188 6.60938 8.25 5.8125 8.25 4.875C8.25 3.9375 7.92188 3.14062 7.26562 2.48438C6.60938 1.82812 5.8125 1.5 4.875 1.5C3.9375 1.5 3.14062 1.82812 2.48438 2.48438C1.82812 3.14062 1.5 3.9375 1.5 4.875C1.5 5.8125 1.82812 6.60938 2.48438 7.26562C3.14062 7.92188 3.9375 8.25 4.875 8.25Z" fill="#ADAAAA"/>
          </svg>
          <span className="font-jakarta text-[10px] tracking-widest uppercase text-[#ADAAAA]">
            Search...
          </span>
        </div>

        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="cursor-pointer">
          <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20Z" fill="#ADAAAA"/>
        </svg>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer font-manrope font-bold text-sm"
          style={{ background: "#FDD34D", color: "#5C4900" }}
        >
          L
        </div>
      </div>
    </header>
  );
}

/* ── Page ────────────────────────────────────────────────── */
export default function DevicesPage() {
  const [roomData, setRoomData] = useState(INITIAL_ROOMS);

  useEffect(() => {
    const ws = new WebSocketClient(1, (message) => {
      if (message.type === "SENSOR_UPDATE") {
        setRoomData(prev => prev.map(room => ({
          ...room,
          devices: room.devices.map(device => {
            const isPrimary = device.feedName === message.feed_name;
            const isAdditional = device.additionalFeeds?.includes(message.feed_name);

            if (isPrimary || isAdditional) {
              if (message.feed_name === "dadn.led-state") {
                const isActivated = message.value === "1";
                return { ...device, isActive: isActivated, status: isActivated ? "on" : "off" };
              }
              
              if (message.feed_name.includes("temperature") || message.feed_name.includes("humidity")) {
                const currentTemp = message.feed_name.includes("temperature") ? message.value : (device.subtitle?.match(/TEMP: ([\d.]+)/)?.[1] || "--");
                const currentHumid = message.feed_name.includes("humidity") ? message.value : (device.subtitle?.match(/HUM: ([\d.]+)/)?.[1] || "--");
                return { ...device, subtitle: `TEMP: ${currentTemp}°C  HUM: ${currentHumid}%` };
              }
            }
            return device;
          })
        })));
      }
    });
    ws.connect();
    return () => ws.disconnect();
  }, []);

  const handleDeviceToggle = async (deviceId: string, nextState: boolean) => {
    let targetFeed = "";
    roomData.forEach(r => r.devices.forEach(d => {
      if (d.id === deviceId) targetFeed = d.feedName || "";
    }));

    // Local optimistic update
    setRoomData(prev => prev.map(room => ({
      ...room,
      devices: room.devices.map(d => d.id === deviceId ? { ...d, isActive: nextState, status: nextState ? "on" : "off" } : d)
    })));

    if (targetFeed) {
      try {
        await deviceService.control({
          home_id: 1,
          feed_name: targetFeed,
          value: nextState ? "1" : "0"
        });
      } catch (error) {
        console.error("Control failed:", error);
        // Revert local state on error
        setRoomData(prev => prev.map(room => ({
          ...room,
          devices: room.devices.map(d => d.id === deviceId ? { ...d, isActive: !nextState, status: !nextState ? "on" : "off" } : d)
        })));
      }
    }
  };

  const connected = roomData.reduce((a, r) => a + r.devices.filter(d => d.status !== "off").length, 0);
  const offline = roomData.reduce((a, r) => a + r.devices.filter(d => d.status === "off").length, 0);

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 ml-20">
        <DevicesTopNav />

        <main className="flex-1 mt-14 overflow-y-auto px-8 py-8 scrollbar-hide">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="font-manrope font-extrabold text-4xl text-white tracking-tight">
                My Devices
              </h1>
              <p className="font-jakarta text-sm mt-1" style={{ color: "#ADAAAA" }}>
                <span className="text-white font-semibold">{connected} Connected</span>
                {" • "}
                <span style={{ color: "#D53D18" }}>{offline} Offline</span>
              </p>
            </div>

            {/* Air Quality pill */}
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
              style={{ background: "#1A1A1A" }}
            >
              <div className="text-right">
                <p className="font-jakarta text-[9px] uppercase tracking-widest text-[#ADAAAA]">
                  Air Quality
                </p>
                <p className="font-manrope font-bold text-sm text-white">Excellent</p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "#ebffe7", boxShadow: "0 0 12px 0 rgba(235,255,231,0.3)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#2d6a4f"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="space-y-10">
            {roomData.map((room) => (
              <section key={room.name}>
                <h2 className="font-manrope font-bold text-base text-white mb-4">
                  {room.name}
                </h2>

                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  }}
                >
                  {room.devices.map((device) => (
                    <DeviceCard 
                      key={device.id} 
                      device={device} 
                      onToggle={(next) => handleDeviceToggle(device.id, next)} 
                    />
                  ))}
                  <AddDeviceCard />
                </div>
              </section>
            ))}
          </div>

          {/* ... (Floating add button stays same) ... */}
          <button
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 z-20"
            style={{
              background: "linear-gradient(135deg, #FDD34D 0%, #E8AA00 100%)",
              boxShadow: "0 0 24px 0 rgba(253,211,77,0.35)",
            }}
            aria-label="Add device"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z" fill="#5C4900"/>
            </svg>
          </button>
        </main>
      </div>
    </div>
  );
}
