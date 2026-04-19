"use client"

import Link from 'next/link';
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import AuthContext from "@/app/context/AuthContext";
import axios from "axios";
import { Eye, Settings, Fingerprint, ScanFace, Key } from "lucide-react";

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
              username: email,
              password: password
          });
          login(email, password);
      } catch (error) {
          console.error('Register Failed:', error);
      }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E0E0E] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full flex justify-between absolute top-0 p-8">
         <h1 className="text-[#FDD34D] font-serif text-xl font-bold tracking-[-0.6px]">G6 YoloHome</h1>
         <div className="flex gap-6 text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px] items-center">
            <Link href="#" className="hover:text-white transition-all hidden sm:block">Help</Link>
            <Link href="#" className="hover:text-white transition-all hidden sm:block">Support</Link>
            <Link href="#" className="hover:text-white transition-all hidden sm:block">Security</Link>
            <button className="hover:text-white cursor-pointer"><Settings className="w-5 h-5"/></button>
         </div>
      </div>

      <div className="w-full max-w-lg mt-16 z-10">
        <div className="bg-[#131313] border border-[#484847]/30 rounded-[32px] p-10 relative overflow-hidden">
          <div className="mb-10 text-center">
            <h2 className="text-white font-serif text-3xl font-extrabold tracking-[-0.75px] mb-2">Create New Home Account</h2>
            <p className="text-[#ADAAAA] text-sm">Design your environment. Secure your sanctuary.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[#ADAAAA] text-xs font-semibold uppercase tracking-[1.2px]">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elias Vance"
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
                placeholder="elias@sanctuary.io"
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
                placeholder="+1 (555) 000-0000"
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

            <div className="flex items-start pt-2">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-5 w-5 bg-[#000000] border border-[#484847]/50 rounded text-[#FDD34D] mt-0.5 cursor-pointer focus:ring-offset-[#131313]"
              />
              <label htmlFor="terms" className="ml-3 block text-sm text-[#ADAAAA] cursor-pointer">
                I agree to the <span className="text-[#FDD34D] hover:underline">Terms of Service</span> and acknowledge the <span className="text-[#FDD34D] hover:underline">Privacy Policy</span> regarding my domestic data.
              </label>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-bold font-serif text-[#5C4900] bg-gradient-to-r from-[#FDD34D] to-[#e4b300] hover:from-[#ffe58f] hover:to-[#FDD34D] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDD34D] focus:ring-offset-[#131313]"
              >
                Create Sanctuary Account
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
        
        <div className="mt-6 flex justify-between px-4 text-[#484847] text-[10px] tracking-widest font-semibold items-center">
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-[#484847]"></div>
               AES-256 ENCRYPTED
            </div>
            <div className="flex gap-3">
               <Fingerprint className="w-4 h-4" />
               <ScanFace className="w-4 h-4" />
               <Key className="w-4 h-4" />
            </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center w-full text-[#484847] text-[10px] tracking-[2px] font-semibold">
          © 2024 LUMINOUS SANCTUARY SYSTEMS. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
