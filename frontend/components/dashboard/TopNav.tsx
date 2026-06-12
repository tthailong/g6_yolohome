"use client";

import { useState, useRef, useEffect } from "react";
import EnvironmentSummary from "./EnvironmentSummary";

/* ── tiny calendar helpers ─────────────────────────────── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return (day + 6) % 7;
}

/* ── Calendar popup ──────────────────────────────────── */
function CalendarPopup({
  selected,
  onSelect,
  onClose,
}: {
  selected: Date;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const [view, setView] = useState({ year: selected.getFullYear(), month: selected.getMonth() });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const daysInMonth = getDaysInMonth(view.year, view.month);
  const firstDay = getFirstDayOfWeek(view.year, view.month);

  const prevMonth = () =>
    setView((v) => {
      const m = v.month === 0 ? 11 : v.month - 1;
      const y = v.month === 0 ? v.year - 1 : v.year;
      return { year: y, month: m };
    });
  const nextMonth = () =>
    setView((v) => {
      const m = v.month === 11 ? 0 : v.month + 1;
      const y = v.month === 11 ? v.year + 1 : v.year;
      return { year: y, month: m };
    });

  // Build grid: leading blanks + days
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full rows
  while (cells.length % 7 !== 0) cells.push(null);

  const isSelected = (d: number) =>
    d === selected.getDate() &&
    view.month === selected.getMonth() &&
    view.year === selected.getFullYear();

  const isToday = (d: number) => {
    const now = new Date();
    return d === now.getDate() && view.month === now.getMonth() && view.year === now.getFullYear();
  };

  return (
    <div
      ref={ref}
      className="absolute top-14 left-0 z-50 rounded-2xl p-4 select-none"
      style={{
        background: "rgba(26,26,26,0.95)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(72,72,71,0.5)",
        boxShadow: "0 24px 64px 0 rgba(0,0,0,0.6)",
        minWidth: "280px",
      }}
    >
      {/* Month / Year navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#262626] transition-colors"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M5 1L1 5L5 9" stroke="#ADAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <span className="font-manrope font-bold text-sm text-white">
          {MONTHS[view.month]} {view.year}
        </span>

        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#262626] transition-colors"
        >
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path d="M1 1L5 5L1 9" stroke="#ADAAAA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center font-jakarta font-bold text-[10px] text-[#484847] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const sel = isSelected(day);
          const tod = isToday(day);
          return (
            <button
              key={i}
              onClick={() => {
                onSelect(new Date(view.year, view.month, day));
                onClose();
              }}
              className="flex items-center justify-center h-8 w-8 mx-auto rounded-lg font-jakarta font-semibold text-xs transition-all duration-150"
              style={{
                background: sel ? "#FDD34D" : tod ? "#262626" : "transparent",
                color: sel ? "#5C4900" : tod ? "#FDD34D" : "#ADAAAA",
                fontWeight: sel || tod ? "700" : "500",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── TopNav ──────────────────────────────────────────── */
export default function TopNav({
  showNotifications = true,
  onToggleNotifications,
  selectedDate,
  onSelectDate,
  hideSummary = false,
}: {
  showNotifications?: boolean;
  onToggleNotifications?: () => void;
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  hideSummary?: boolean;
}) {
  const [calOpen, setCalOpen] = useState(false);

  const weekday = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  const month   = selectedDate.toLocaleDateString("en-US", { month: "long" });
  const day     = selectedDate.getDate();
  const year    = selectedDate.getFullYear();

  // 12-hour clock
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = (hours % 12 || 12).toString().padStart(2, "0");
  const timeStr = `${h12}:${minutes} ${ampm}`;

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between h-16 px-6 md:px-8"
      style={{
        left: "60px",
        borderBottom: "1px solid #484847",
        background: "#0E0E0E",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Left: Time + clickable Date */}
      <div className="flex items-center gap-2 relative">
        <span className="font-manrope font-extrabold text-lg md:text-xl text-white tracking-tight">
          {timeStr}
        </span>
        <span className="font-manrope font-bold text-base md:text-lg" style={{ color: "#FDD34D" }}>
          •
        </span>

        {/* Clickable date */}
        <button
          onClick={() => setCalOpen((v) => !v)}
          className="flex items-center gap-1.5 font-jakarta font-medium text-sm hidden sm:flex rounded-lg px-2 py-1 transition-all duration-150 hover:bg-[#1A1A1A] active:bg-[#262626]"
          style={{ color: calOpen ? "#FDD34D" : "#ADAAAA" }}
          aria-label="Open calendar"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M1 5.5H13M4 1V3M10 1V3M2.5 2H11.5C12.3284 2 13 2.67157 13 3.5V11.5C13 12.3284 12.3284 13 11.5 13H2.5C1.67157 13 1 12.3284 1 11.5V3.5C1 2.67157 1.67157 2 2.5 2Z"
              stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {weekday}, {month} {day}, {year}
        </button>

        {/* Calendar popup */}
        {calOpen && (
          <CalendarPopup
            selected={selectedDate}
            onSelect={onSelectDate}
            onClose={() => setCalOpen(false)}
          />
        )}
      </div>

      {/* Right: Environment Summary (instead of Search) + Bell + Avatar */}
      <div className="flex items-center gap-4 md:gap-6">
        {!hideSummary && (
          <div className="hidden md:block">
            <EnvironmentSummary />
          </div>
        )}

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
