"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Home as HomeIcon, Key, Server, Trash2, ShieldAlert, Loader2 } from "lucide-react";
import { homeService, Home } from "@/lib/api/homes";

export default function ManageHomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const homeId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [adafruitUser, setAdafruitUser] = useState("");
  const [adafruitKey, setAdafruitKey] = useState("");

  useEffect(() => {
    if (!homeId) {
      router.push("/homes");
      return;
    }

    const fetchHome = async () => {
      try {
        setLoading(true);
        const data = await homeService.getHomeById(Number(homeId));
        if (data) {
          setName(data.name);
          setAdafruitUser(data.adafruitiouser || "");
          setAdafruitKey(data.adafruitiokey || "");
        } else {
          router.push("/homes");
        }
      } catch (error) {
        console.error("Failed to fetch home details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [homeId, router]);

  const handleSave = async () => {
    if (!homeId) return;
    try {
      setSaving(true);
      await homeService.updateHome(Number(homeId), {
        name,
        adafruitiouser: adafruitUser,
        adafruitiokey: adafruitKey
      });
      router.push("/homes");
    } catch (error) {
      console.error("Failed to update home:", error);
      alert("Failed to update home settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!homeId) return;
    if (!window.confirm("Are you sure you want to delete this home? This action cannot be undone.")) return;
    
    try {
      setSaving(true);
      await homeService.deleteHome(Number(homeId));
      router.push("/homes");
    } catch (error) {
      console.error("Failed to delete home:", error);
      alert("Failed to delete home.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FDD34D] animate-spin" />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0E0E0E] text-white font-sans overflow-y-auto">
        {/* Luminous Glow Effects */}
        <div className="fixed top-[-200px] left-[10%] w-[500px] h-[400px] bg-[#FDD34D]/[0.05] blur-[60px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto w-full px-6 py-12 md:py-24 z-10 relative">
          
          <div className="flex items-center gap-4 mb-12">
            <Link href="/homes">
              <Button variant="ghost" className="p-2 hover:bg-[#1A1A1A] hover:text-white rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold font-serif tracking-tight">Home Settings</h1>
          </div>

          <div className="bg-[#131313] border border-[#484847] rounded-2xl p-6 md:p-10 space-y-10 shadow-2xl">
            
            {/* Basic Info */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-[#484847]/30 pb-3 font-serif">
                <HomeIcon className="w-5 h-5 text-[#FDD34D]" />
                General Information
              </h2>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Sanctuary Name</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#0E0E0E] border-[#484847] text-white py-6 focus:border-[#FDD34D] transition-colors"
                />
              </div>
            </div>

            {/* Server Config */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-[#484847]/30 pb-3 mt-8 font-serif">
                <Server className="w-5 h-5 text-[#FDD34D]" />
                Server Configuration (Adafruit IO)
              </h2>
              <p className="text-sm text-[#ADAAAA] leading-relaxed">
                Update your MQTT credentials to ensure seamless communication with your hardware devices.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Adafruit Username</label>
                <Input 
                  value={adafruitUser}
                  onChange={(e) => setAdafruitUser(e.target.value)}
                  placeholder="Enter username..." 
                  className="bg-[#0E0E0E] border-[#484847] text-white py-6 focus:border-[#FDD34D] transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#ADAAAA]">Adafruit IO Key</label>
                <div className="relative">
                  <Input 
                    type="password"
                    value={adafruitKey}
                    onChange={(e) => setAdafruitKey(e.target.value)}
                    placeholder="aio_..." 
                    className="bg-[#0E0E0E] border-[#484847] text-white py-6 pr-12 focus:border-[#FDD34D] transition-colors"
                  />
                  <Key className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADAAAA] w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-6 pt-6">
              <h2 className="text-lg font-bold flex items-center gap-2 border-b border-red-500/30 text-red-500 pb-3 font-serif">
                <ShieldAlert className="w-5 h-5" />
                Danger Zone
              </h2>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-red-500/5 p-6 rounded-xl border border-red-500/20">
                <div>
                  <h3 className="font-bold text-white">Delete this Sanctuary</h3>
                  <p className="text-xs text-[#ADAAAA] mt-2">This action is permanent. All device configurations and history will be lost.</p>
                </div>
                <Button 
                  onClick={handleDelete}
                  variant="outline" 
                  disabled={saving}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold px-6 shrink-0"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Permanently
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-8 flex justify-end gap-4 border-t border-[#484847]/30">
              <Link href="/homes">
                <Button variant="outline" className="border-[#484847] text-[#ADAAAA] hover:text-white hover:bg-[#1a1a1a] px-8">
                  Cancel
                </Button>
              </Link>
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-[#FDD34D] text-[#5C4900] hover:bg-[#e5bc3e] font-bold px-10 shadow-lg shadow-[#FDD34D]/10"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Configuration
              </Button>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}