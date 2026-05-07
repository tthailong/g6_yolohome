"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E0E] text-white font-sans relative overflow-hidden">
      {/* Luminous Glow Effects */}
      <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-[#FDD34D]/[0.05] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-[#D53D18]/[0.05] blur-[60px] rounded-full pointer-events-none" />

      <div className="text-center z-10 space-y-6 max-w-lg px-4">
        <div className="w-24 h-24 bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto border border-[#2A2A2A] shadow-xl">
          <AlertTriangle className="w-12 h-12 text-[#FDD34D]" />
        </div>
        
        <h1 className="font-serif text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-[#ADAAAA] tracking-tighter">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Lạc đường rồi!</h2>
          <p className="text-[#ADAAAA]">
            Khu vực bạn đang cố gắng truy cập không tồn tại trong hệ thống G6 YoloHome, hoặc bạn không có quyền truy cập.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/">
            <Button className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold px-8 py-6 rounded-xl text-lg flex items-center gap-2 mx-auto">
              <Home className="w-5 h-5" />
              Trở về trung tâm điều khiển
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}