"use client"

import Link from 'next/link';
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/AuthContext";
import { User, Lock } from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
           <h1 className="text-[#FDD34D] font-serif text-2xl font-bold tracking-[-0.6px]">G6 YoloHome</h1>
        </div>

        <div className="bg-[#131313] rounded-[32px] p-10 relative overflow-hidden">
          <div className="mb-10 text-center">
            <h2 className="text-white font-serif text-3xl font-extrabold tracking-[-0.75px] mb-2">Welcome Back</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px]">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="nguyenvana"
                  className="w-full bg-[#262626] text-white placeholder-[#767575] rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#ADAAAA]">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px]">
                  Password
                </label>
                <Link href="#" className="flex text-[#FDD34D] font-serif text-xs font-bold hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#262626] text-white placeholder-[#767575] rounded-xl py-4 px-5 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-[#ADAAAA]">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] text-lg font-bold font-serif text-[#5C4900] bg-gradient-to-r from-[#FDD34D] to-[#e4b300] hover:from-[#ffe58f] hover:to-[#FDD34D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDD34D] focus:ring-offset-[#131313] transition-all cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <span className="text-[#ADAAAA] text-sm">Dont have account? </span>
            <Link href="/register" className="text-[#FDD34D] font-bold text-sm hover:text-white transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
