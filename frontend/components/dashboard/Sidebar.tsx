"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-full w-[60px] md:w-20 flex flex-col justify-between items-center py-6 md:py-8 z-40"
      style={{
        background: "linear-gradient(90deg, #0E0E0E 0%, #1A1A1A 100%)",
        boxShadow: "4px 0 24px 0 rgba(0,0,0,0.5)",
        borderRight: "1px solid rgba(0,0,0,0)",
      }}
    >
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Logo */}
        <div className="flex justify-center w-full mb-2">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: "#FDD34D" }}
          >
            <span className="font-manrope font-bold text-xl" style={{ color: "#5C4900", lineHeight: "28px" }}>
              L
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col items-center gap-2 w-full">
          {/* Dashboard */}
          <Link href="/" className="relative flex justify-center w-full py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9.8 5.88V0H17.64V5.88H9.8ZM0 9.8V0H7.84V9.8H0ZM9.8 17.64V7.84H17.64V17.64H9.8ZM0 17.64V11.76H7.84V17.64H0Z" fill={pathname === "/" ? "#FDD34D" : "#ADAAAA"}/>
            </svg>
            {pathname === "/" && <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#FDD34D]" />}
          </Link>

          {/* Devices */}
          <Link href="/devices" className="relative flex justify-center w-full py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] transition-colors">
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
              <path d="M0 16V14H10V16H0ZM3 13C2.45 13 1.97917 12.8042 1.5875 12.4125C1.19583 12.0208 1 11.55 1 11V2C1 1.45 1.19583 0.979167 1.5875 0.5875C1.97917 0.195833 2.45 0 3 0H17C17.55 0 18.0208 0.195833 18.4125 0.5875C18.8042 0.979167 19 1.45 19 2H3V11H10V13H3ZM18 14V6H14V14H18ZM13.5 16C13.0833 16 12.7292 15.8542 12.4375 15.5625C12.1458 15.2708 12 14.9167 12 14.5V5.5C12 5.08333 12.1458 4.72917 12.4375 4.4375C12.7292 4.14583 13.0833 4 13.5 4H18.5C18.9167 4 19.2708 4.14583 19.5625 4.4375C19.8542 4.72917 20 5.08333 20 5.5V14.5C20 14.3833 18.5125 15.5625 17.5375 16.5375C16.5625 17.5125 15.3833 18 14 18H0Z" fill={pathname.startsWith("/devices") ? "#FDD34D" : "#ADAAAA"}/>
            </svg>
            {pathname.startsWith("/devices") && <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-[#FDD34D]" />}
          </Link>

          {/* Members (Placeholder) */}
          <div className="relative flex justify-center w-full py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] transition-colors">
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <path d="M0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM18 16V13C18 12.2667 17.7958 11.5625 17.3875 10.8875C16.9792 10.2125 16.4 9.63333 15.65 9.15C16.5 9.25 17.3 9.42083 18.05 9.6625C18.8 9.90417 19.5 10.2 20.15 10.55C20.75 10.8833 21.2083 11.2542 21.525 11.6625C21.8417 12.0708 22 12.5167 22 13V16H18ZM14 4C14 4.7 13.8792 5.375 13.6375 6.025C13.3958 6.675 13.05 7.26667 12.6 7.8C12.8333 7.97917 13.0667 7.9375 13.3 7.9375C13.5333 7.97917 13.7667 8 14 8C15.1 8 16.0417 7.60833 16.825 6.825C17.6083 6.04167 18 5.1 18 4C18 2.9 17.6083 1.95833 16.825 1.175C16.0417 0.391667 15.1 0 14 0C13.7667 0 13.5333 0.0125 13.3 0.0375C13.0667 0.0625 12.8333 0.116667 12.6 0.2C13.05 0.733333 13.3958 1.325 13.6375 1.975C13.8792 2.625 14 3.3 14 4Z" fill="#ADAAAA"/>
            </svg>
          </div>

          {/* Settings (Placeholder) */}
          <div className="relative flex justify-center w-full py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] transition-colors">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3ZM9.05 18H11.025L11.375 15.35C11.8917 15.2167 12.3708 15.0208 12.8125 14.7625C13.2542 14.5042 13.6583 14.1917 14.025 13.825L16.5 14.85L17.475 13.15L15.325 11.525C15.4083 11.2917 15.4667 11.0458 15.5 10.7875C15.5333 10.5292 15.55 10.2667 15.55 10C15.55 9.73333 15.5333 9.47083 15.5 9.2125C15.4667 8.95417 15.4083 8.70833 15.325 8.475L17.475 6.85L16.5 5.15L14.025 6.2C13.6583 5.81667 13.2542 5.49583 12.8125 5.2375C12.3708 4.97917 11.8917 4.78333 11.375 4.65L11.05 2H9.075L8.725 4.65C8.20833 4.78333 7.72917 4.97917 7.2875 5.2375C6.84583 5.49583 6.44167 5.80833 6.075 6.175L3.6 5.15L2.625 6.85L4.775 8.45C4.69167 8.7 4.63333 8.95 4.6 9.2C4.56667 9.45 4.55 9.71667 4.55 10C4.55 10.2667 4.56667 10.525 4.6 10.775C4.63333 11.025 4.69167 11.275 4.775 11.525L2.625 13.15L3.6 14.85L6.075 13.8C6.44167 14.1833 6.84583 14.5042 7.2875 14.7625C7.72917 15.0208 8.20833 15.2167 8.725 15.35L9.05 18ZM10.1 13.5C11.0667 13.5 11.8917 13.1583 12.575 12.475C13.2583 11.7917 13.6 10.9667 13.6 10C13.6 9.03333 13.2583 8.20833 12.575 7.525C11.8917 6.84167 11.0667 6.5 10.1 6.5C9.11667 6.5 8.2875 6.84167 7.6125 7.525C6.9375 8.20833 6.6 9.03333 6.6 10C6.6 10.9667 6.9375 11.7917 7.6125 12.475C8.2875 13.1583 9.11667 13.5 10.1 13.5Z" fill="#ADAAAA"/>
            </svg>
          </div>
        </nav>
      </div>

      {/* Logout */}
      <div className="relative flex justify-center w-full py-3 rounded-xl cursor-pointer hover:bg-[#1A1A1A] transition-colors">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="#D53D18"/>
        </svg>
      </div>
    </aside>
  );
}
