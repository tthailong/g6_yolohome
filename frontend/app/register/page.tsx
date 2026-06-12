"use client"

import Link from 'next/link';
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/AuthContext";
import axios from "axios";
import { Eye } from "lucide-react";

export default function Register() {
  const { login } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:8000/auth/', {
              username: fullName,
              email: email,
              phone: phone,
              password: password
          });
          login(email, password);
      } catch (error) {
          console.error('Register Failed:', error);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center mb-8">
           <h1 className="text-[#FDD34D] font-serif text-2xl font-bold tracking-[-0.6px]">G6 YoloHome</h1>
        </div>

        <div className="bg-[#131313] border border-[#484847]/30 rounded-[32px] p-10 relative overflow-hidden">
          <div className="mb-10 text-center">
            <h2 className="text-white font-serif text-3xl font-extrabold tracking-[-0.75px] mb-2">Create New Account</h2>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px]">
                User Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="nguyenvana"
                className="w-full bg-[#000000] border border-[#484847]/50 text-white placeholder-[#6B7280] rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px]">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguyenvana@gmail.com"
                className="w-full bg-[#000000] border border-[#484847]/50 text-white placeholder-[#6B7280] rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
               <label className="block text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px]">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0123456789"
                className="w-full bg-[#000000] border border-[#484847]/50 text-white placeholder-[#6B7280] rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#000000] border border-[#484847]/50 text-white placeholder-[#6B7280] rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#FDD34D] transition-colors pr-10"
                  required
                />
                <button
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-[#ADAAAA] hover:text-white transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold font-serif text-[#5C4900] bg-gradient-to-r from-[#FDD34D] to-[#e4b300] hover:from-[#ffe58f] hover:to-[#FDD34D] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDD34D] focus:ring-offset-[#131313]"
              >
                Sign up
              </button>
            </div>
            
            <div className="pt-8 text-center border-t border-[#484847]/30 mt-8 flex justify-center w-full">
               <div className="pt-4 text-center w-full">
                  <span className="text-[#ADAAAA] text-sm">Already have an account? </span>
                  <Link href="/login" className="text-[#FDD34D] font-bold text-sm hover:text-white transition-colors">
                    Sign In
                  </Link>
               </div>
            </div>
          </form>
        </div>
        

      </div>
      

    </div>
  );
}
