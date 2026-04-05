function TemperatureCard() {
  return (
    <div
      className="flex flex-col gap-2 p-6 pb-8 rounded-xl overflow-hidden"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      <p className="font-jakarta font-bold text-[11px] uppercase tracking-widest" style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}>
        Temperature
      </p>
      <div className="flex items-end gap-1 relative h-14">
        <span className="font-manrope font-extrabold text-5xl text-white leading-none">36</span>
        <span className="font-manrope font-bold text-2xl pb-1" style={{ color: "#FDD34D" }}>°C</span>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.7 6L0 5.3L3.7 1.575L5.7 3.575L8.3 1H7V0H10V3H9V1.7L5.7 5L3.7 3L0.7 6Z" fill="#FF7351" />
        </svg>
        <span className="font-manrope font-bold text-[10px]" style={{ color: "#FF7351" }}>
          +2.4° vs avg
        </span>
      </div>
    </div>
  );
}

function HumidityCard() {
  return (
    <div
      className="flex flex-col gap-2 p-6 pb-8 rounded-xl overflow-hidden"
      style={{ background: "#131313", border: "1px solid #484847" }}
    >
      <p className="font-jakarta font-bold text-[11px] uppercase tracking-widest" style={{ color: "#ADAAAA", letterSpacing: "1.2px" }}>
        Humidity
      </p>
      <div className="flex items-end gap-1 relative h-14">
        <span className="font-manrope font-extrabold text-5xl text-white leading-none">67</span>
        <span className="font-manrope font-bold text-2xl pb-1" style={{ color: "#F5D1FB" }}>%</span>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.3 7.3L7.825 3.775L7.125 3.075L4.3 5.9L2.875 4.475L2.175 5.175L4.3 7.3ZM5 10C4.30833 10 3.65833 9.86875 3.05 9.60625C2.44167 9.34375 1.9125 8.9875 1.4625 8.5375C1.0125 8.0875 0.65625 7.55833 0.39375 6.95C0.13125 6.34167 0 5.69167 0 5C0 4.30833 0.13125 3.65833 0.39375 3.05C0.65625 2.44167 1.0125 1.9125 1.4625 1.4625C1.9125 1.0125 2.44167 0.65625 3.05 0.39375C3.65833 0.13125 4.30833 0 5 0C5.69167 0 6.34167 0.13125 6.95 0.39375C7.55833 0.65625 8.0875 1.0125 8.5375 1.4625C8.9875 1.9125 9.34375 2.44167 9.60625 3.05C9.86875 3.65833 10 4.30833 10 5C10 5.69167 9.86875 6.34167 9.60625 6.95C9.34375 7.55833 8.9875 8.0875 8.5375 8.5375C8.0875 8.9875 7.55833 9.34375 6.95 9.60625C6.34167 9.86875 5.69167 10 5 10ZM5 9C6.11667 9 7.0625 8.6125 7.8375 7.8375C8.6125 7.0625 9 6.11667 9 5C9 3.88333 8.6125 2.9375 7.8375 2.1625C7.0625 1.3875 6.11667 1 5 1C3.88333 1 2.9375 1.3875 2.1625 2.1625C1.3875 2.9375 1 3.88333 1 5C1 6.11667 1.3875 7.0625 2.1625 7.8375C2.9375 8.6125 3.88333 9 5 9Z" fill="#EBFFE7" />
        </svg>
        <span className="font-manrope font-bold text-[10px]" style={{ color: "#EBFFE7" }}>
          Optimal Range
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
      {/* Member avatars */}
      <div className="flex items-center pt-1" style={{ gap: "-4px" }}>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/992b15a84072046ffa64a851d688cbe2fdbe1a78?width=48"
          alt="Member"
          className="w-6 h-6 rounded-sm object-cover flex-shrink-0"
          style={{ border: "1px solid #484847" }}
        />
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/3bbb6acf35bf92390fe6a4c3814cff6cde37c22b?width=48"
          alt="Member"
          className="w-6 h-6 rounded-sm object-cover flex-shrink-0 -ml-1"
          style={{ border: "1px solid #484847" }}
        />
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/fc55e4f39d99c03865ff31111f84fa8490eb24eb?width=48"
          alt="Member"
          className="w-6 h-6 rounded-sm object-cover flex-shrink-0 -ml-1"
          style={{ border: "1px solid #484847" }}
        />
        {/* +2 badge */}
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
      <TemperatureCard />
      <HumidityCard />
      <MembersCard />
    </div>
  );
}
