"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import EnvironmentSummary from "@/components/dashboard/EnvironmentSummary";
import DeviceCard, { AddDeviceCard } from "@/components/dashboard/DeviceCard";
import type { DeviceCardData } from "@/components/dashboard/DeviceCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { WebSocketClient } from "@/lib/api/socket";
import { deviceService } from "@/lib/api/devices";
import { useDevices } from "@/app/context/DeviceContext";

/* ── Icons ───────────────────────────────────────────────────────── */
const BulbIcon = () => (
  <svg width="60" height="84" viewBox="0 0 24 34" fill="none">
    <path d="M12 0C5.37258 0 0 5.37258 0 12C0 16.0353 2.01633 19.6053 5 21.6445V25C5 26.1046 5.89543 27 7 27H17C18.1046 27 19 26.1046 19 25V21.6445C21.9837 19.6053 24 16.0353 24 12C24 5.37258 18.6274 0 12 0ZM7 31H17V29H7V31ZM10 34H14V32H10V34Z" fill="currentColor"/>
  </svg>
);

const SunSmallIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 4V2H12.01V4H12ZM12 20V22H12.01V20H12ZM4 12H2V12.01H4V12ZM22 12H20V12.01H22V12ZM6.34 6.34L4.93 4.93L4.92 4.92L6.33 6.33L6.34 6.34ZM17.66 17.66L19.07 19.07L19.08 19.08L17.67 17.67L17.66 17.66ZM17.66 6.34L19.07 4.93L19.08 4.92L17.67 6.33L17.66 6.34ZM6.34 17.66L4.93 19.07L4.92 19.08L6.33 17.67L6.34 17.66Z" fill="#ADAAAA"/>
  </svg>
);

const SunLargeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19ZM12 3V1H12.01V3H12ZM12 21V23H12.01V21H12ZM3 12H1V12.01H3V12ZM23 12H21V12.01H23V12ZM5.64 5.64L4.23 4.23L4.22 4.22L5.63 5.63L5.64 5.64ZM18.36 18.36L19.77 19.77L19.78 19.78L18.37 18.37L18.36 18.36ZM18.36 5.64L19.77 4.23L19.78 4.22L18.37 5.63L18.36 5.64ZM5.64 18.36L4.23 19.77L4.22 19.78L5.63 18.37L5.64 18.36Z" fill="#FDD34D"/>
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

const LightIcon = () => (
  <svg width="15" height="21" viewBox="0 0 24 34" fill="none">
    <path d="M12 0C5.37258 0 0 5.37258 0 12C0 16.0353 2.01633 19.6053 5 21.6445V25C5 26.1046 5.89543 27 7 27H17C18.1046 27 19 26.1046 19 25V21.6445C21.9837 19.6053 24 16.0353 24 12C24 5.37258 18.6274 0 12 0ZM7 31H17V29H7V31ZM10 34H14V32H10V34Z" fill="currentColor"/>
  </svg>
);

const FanIcon = ({ isOn }: { isOn?: boolean }) => (
  <svg 
    width="22" height="22" viewBox="0 0 24 24" fill="none"
    className={isOn ? "animate-spin-slow" : ""}
    style={{ animationDuration: '2s' }}
  >
    <path d="M10.85 12c0-1.25-.11-2.43-.31-3.53C10.15 6.44 9.19 5 7.81 5c-1.52 0-2.75 2.1-2.75 4.69 0 2.14.85 3.93 2.1 4.51.52.24 1.14.3 1.76.3H10.85Z" fill="currentColor"/>
    <path d="M12 10.85c1.25 0 2.43-.11 3.53-.31 2.03-.39 3.47-1.35 3.47-2.73 0-1.52-2.1-2.75-4.69-2.75-2.14 0-3.93.85-4.51 2.1-.24.52-.3 1.14-.3 1.76v1.93Z" fill="currentColor"/>
    <path d="M13.15 12c0 1.25.11 2.43.31 3.53.39 2.03 1.35 3.47 2.73 3.47 1.52 0 2.75-2.1 2.75-4.69 0-2.14-.85-3.93-2.1-4.51-.52-.24-1.14-.3-1.76-.3h-1.93Z" fill="currentColor"/>
    <path d="M12 13.15c-1.25 0-2.43.11-3.53.31-2.03.39-3.47 1.35-3.47 2.73 0 1.52 2.1 2.75 4.69 2.75 2.14 0 3.93-.85 4.51-2.1.24-.52.3-1.14.3-1.76v-1.93Z" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" />
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
        status: "off",
        isActive: false,
        feedName: "dadn.fan-state",
        additionalFeeds: ["dadn.fan-speed"],
        icon: <FanIcon />,
        href: "/devices/fan",
      },
      {
        id: "d3",
        name: "Living Room Door",
        subtitle: "Secured",
        status: "locked",
        feedName: "dadn.door-state",
        icon: <LockIcon />,
        href: "/devices/door",
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
        name: "Bedroom Door",
        subtitle: "Secured",
        status: "locked",
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
function DevicesTopNav({ 
  showNotifications, 
  onToggleNotifications 
}: { 
  showNotifications: boolean; 
  onToggleNotifications: () => void;
}) {
  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between h-16 px-6 md:px-8"
      style={{
        left: "80px",
        background: "#0E0E0E",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #484847",
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

      {/* Right: Environment Summary (instead of Search) + Bell + Avatar (Matching Dashboard) */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:block">
          <EnvironmentSummary />
        </div>

        {/* Bell — toggles notification panel */}
        <button
          onClick={onToggleNotifications}
          className="relative p-1 rounded-lg transition-all duration-200 hover:bg-[#1A1A1A]"
          aria-label="Toggle notifications"
        >
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none"
            style={{ filter: showNotifications ? "drop-shadow(0 0 6px #FDD34D)" : "none" }}
          >
            <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z"
              fill={showNotifications ? "#FDD34D" : "#ADAAAA"}
            />
          </svg>
          {/* Active dot */}
          {showNotifications && (
            <span
              className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
              style={{ background: "#FDD34D" }}
            />
          )}
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
          style={{ border: "1px solid #484847", background: "#262626" }}
        >
          <img
            src="https://img.pokemondb.net/artwork/large/dragonair.jpg"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}


export default function DevicesPage() {
  const router = useRouter();
  const { deviceStates, pendingDevices, updateDeviceState } = useDevices();
  const [showNotifications, setShowNotifications] = useState(true);
  const [isBedroomDoorLocked, setIsBedroomDoorLocked] = useState(true);
  const lastActionTime = useRef(0);

  // Map global context state to our room data structure
  const roomData = INITIAL_ROOMS.map(room => ({
    ...room,
    devices: room.devices.map(device => {
      const globalValue = deviceStates[device.feedName || ""];
      const additionalValue1 = device.additionalFeeds?.[0] ? deviceStates[device.additionalFeeds[0]] : null;
      
      let updatedDevice = { ...device };

      if (device.feedName === "dadn.led-state") {
        const isActivated = globalValue === "1";
        const rawBrightness = deviceStates["dadn.led-sate"] || "85";
        const brightnessValue = Math.round(parseFloat(rawBrightness));
        
        updatedDevice.isActive = isActivated;
        updatedDevice.status = isActivated ? "on" : "off";
        updatedDevice.subtitle = isActivated ? `Brightness ${brightnessValue}%` : "Off";
      }

      if (device.feedName === "dadn.door-state") {
        const isLocked = globalValue === "1";
        updatedDevice.isActive = isLocked;
        //updatedDevice.status = isLocked ? "locked" : "unlocked";
        updatedDevice.subtitle = isLocked ? "Secured" : "Unlocked";
        updatedDevice.icon = <LockIcon />;
      }

      if (device.id === "d6") {
        updatedDevice.isActive = isBedroomDoorLocked;
        //updatedDevice.status = isBedroomDoorLocked ? "locked" : "unlocked";
        updatedDevice.subtitle = isBedroomDoorLocked ? "Secured" : "Unlocked";
      }

      if (device.feedName === "dadn.fan-state") {
        const isActivated = globalValue === "1";
        const rawSpeed = deviceStates["dadn.fan-speed"] || "0";
        const speedValue = Math.round(parseFloat(rawSpeed));
        
        updatedDevice.isActive = isActivated;
        updatedDevice.status = isActivated ? "on" : "off";
        if (isActivated) {
          updatedDevice.subtitle = `Speed ${speedValue}% • On`;
        } else {
          updatedDevice.subtitle = "Off";
        }
        // Pass the active state directly to the icon to spin continuously when ON
        updatedDevice.icon = <FanIcon isOn={isActivated} />;
      }

      if (device.feedName?.includes("temperature")) {
        const currentTemp = globalValue || "--";
        const currentHumid = additionalValue1 || "--";
        updatedDevice.subtitle = `TEMP: ${currentTemp}°C  HUM: ${currentHumid}%`;
      }

      return updatedDevice;
    })
  }));

  const handleDeviceToggle = async (deviceId: string, nextState: boolean) => {
    lastActionTime.current = Date.now();
    
    if (deviceId === "d6") {
      setIsBedroomDoorLocked(nextState);
      return;
    }

    let targetFeed = "";
    INITIAL_ROOMS.forEach(r => r.devices.forEach(d => {
      if (d.id === deviceId) targetFeed = d.feedName || "";
    }));

    if (targetFeed) {
      try {
        const valueToSend = nextState ? "1" : "0";
        await updateDeviceState(targetFeed, valueToSend);
        if (targetFeed === "dadn.fan-state" && nextState) {
          const rawSpeed = deviceStates["dadn.fan-speed"] || "0";
          const speedValue = Math.round(parseFloat(rawSpeed));
          if (speedValue < 50) {
            await updateDeviceState("dadn.fan-speed", "50");
          }
        }
      } catch (error) {
        console.error("Control failed:", error);
      }
    }
  };
  const connected = roomData.reduce((a, r) => a + r.devices.filter(d => d.status !== "off").length, 0);
  const offline = roomData.reduce((a, r) => a + r.devices.filter(d => d.status === "off").length, 0);

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] text-white font-sans overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 ml-20">
        <DevicesTopNav 
          showNotifications={showNotifications} 
          onToggleNotifications={() => setShowNotifications(!showNotifications)}
        />

        <main className="flex flex-1 mt-16 overflow-hidden">
          {/* Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-hide transition-all duration-300">
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
              {(() => {
                // Calculate max columns based on the room with most devices
                const maxCols = Math.max(...roomData.map(r => r.devices.length + 1));
                
                return roomData.map((room) => (
                  <section key={room.name}>
                    <h2 className="font-manrope font-bold text-base text-white mb-4">
                      {room.name}
                    </h2>
    
                    <div
                      className="grid gap-4"
                      style={{
                        gridTemplateColumns: `repeat(${maxCols}, 1fr)`,
                      }}
                    >
                      {room.devices.map((device) => (
                        <DeviceCard 
                          key={device.id} 
                          device={device} 
                          onToggle={(next) => handleDeviceToggle(device.id, next)} 
                          isPending={pendingDevices[device.feedName || ""]}
                        />
                      ))}
                      <AddDeviceCard onClick={() => router.push("/devices/add")} />
                    </div>
                  </section>
                ));
              })()}
            </div>
          </div>

          {/* Right Sidebar - Recent Activity (toggleable) */}
          <div
            className="hidden xl:flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              width: showNotifications ? "24rem" : "0px",
              opacity: showNotifications ? 1 : 0,
            }}
          >
            <div className="w-96 h-full p-4 md:p-8 sticky top-0 shrink-0">
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}