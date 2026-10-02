"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  User, 
  Shield, 
  Key, 
  Bell, 
  Smartphone, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Camera, 
  Lock, 
  Save,
  Laptop,
  Radio,
  X,
  ShieldCheck
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const RECENT_ACTIVITY = [
  { id: "ACT-01", action: "Acknowledged Alert ALT-8902", detail: "Teesta River Flood Warning", time: "12m ago" },
  { id: "ACT-02", action: "Dispatched Emergency Field Patrol", detail: "Assigned Inspector Rawat to Western Ridge", time: "45m ago" },
  { id: "ACT-03", action: "Calibrated Slopemeter Sensor Grid", detail: "Updated alert threshold to 35mm displacement", time: "2h ago" },
  { id: "ACT-04", action: "Exported Incident Forensics Report", detail: "PDF archive generated for EOC briefing", time: "4h ago" },
  { id: "ACT-05", action: "Authenticated via Hardware MFA Token", detail: "IP 103.24.12.8 (Gangtok EOC Terminal)", time: "6h ago" },
];

export default function OperatorProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [profileData, setProfileData] = useState({
    name: "Dr. Alok Verma",
    callsign: "COMMAND-1",
    email: "alok.verma@geoshield.gov.in",
    role: "Lead Disaster Risk Officer & Incident Commander",
    agency: "National Disaster Management Authority (NDMA)",
    phone: "+91 98765 43210"
  });

  const [notifPrefs, setNotifPrefs] = useState({
    criticalSirens: true,
    emailBriefs: true,
    smsDispatches: true,
    fieldPatrolUpdates: false
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setToastMessage("Operator profile credentials updated successfully.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSignOutAll = () => {
    if (confirm("Are you sure you want to terminate all 3 active operator sessions across all terminals?")) {
      setToastMessage("All remote sessions terminated. Only current session active.");
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400/60 hover:text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Profile Dossier Hero */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
              AV
            </div>
            <button 
              title="Update Officer Photo"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-white">{profileData.name}</h1>
              <Badge variant="success" className="text-[10px]">
                <ShieldCheck className="w-3 h-3 mr-1 inline" /> Level 4 Commander
              </Badge>
              <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                {profileData.callsign}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{profileData.email}</p>
            <p className="text-xs text-blue-400 mt-0.5">{profileData.agency} • {profileData.role}</p>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 border-t border-slate-800 mt-6 pt-4 overflow-x-auto text-xs">
          {[
            { id: "personal", label: "Personal Information", icon: User },
            { id: "security", label: "Security & Credentials", icon: Lock },
            { id: "notifications", label: "Dispatch Preferences", icon: Bell },
            { id: "sessions", label: "Active Terminals", icon: Laptop },
            { id: "activity", label: "Command Activity Log", icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "personal" && (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Operator Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">Official Name</label>
              <input 
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">Callsign Identifier</label>
              <input 
                type="text"
                value={profileData.callsign}
                onChange={(e) => setProfileData({ ...profileData, callsign: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">Government Email</label>
              <input 
                type="email"
                disabled
                value={profileData.email}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 text-slate-400 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">Emergency Duty Phone</label>
              <input 
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save Changes
            </Button>
          </div>
        </form>
      )}

      {activeTab === "security" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-white">Password & Authentication</h2>
            
            <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-semibold text-white">Master Access Password</div>
                <div className="text-slate-400 text-[11px]">Last rotated 24 days ago • Minimum 12 characters required</div>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-semibold text-white flex items-center gap-2">
                  <span>Hardware Security Key (FIDO2 / YubiKey)</span>
                  <Badge variant="success" className="text-[10px]">Active</Badge>
                </div>
                <div className="text-slate-400 text-[11px]">Primary authentication factor linked to official terminal</div>
              </div>
              <Button variant="secondary" size="sm">Manage Keys</Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Alert Dispatch & Notification Channels</h2>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Critical Severity Sirens & Audio Banners</div>
                <div className="text-slate-400 text-[11px]">Immediate tone alert on threshold exceedance</div>
              </div>
              <input 
                type="checkbox" 
                checked={notifPrefs.criticalSirens}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, criticalSirens: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-blue-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">SMS Priority Transmissions</div>
                <div className="text-slate-400 text-[11px]">Direct SMS dispatch to registered mobile phone</div>
              </div>
              <input 
                type="checkbox" 
                checked={notifPrefs.smsDispatches}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, smsDispatches: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-blue-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-950/70 rounded-lg border border-slate-800 cursor-pointer">
              <div>
                <div className="font-semibold text-white">Shift Handover Summary Email</div>
                <div className="text-slate-400 text-[11px]">Receive compiled 24h operational snapshot at 08:00 IST</div>
              </div>
              <input 
                type="checkbox" 
                checked={notifPrefs.emailBriefs}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, emailBriefs: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-blue-500 w-4 h-4"
              />
            </label>
          </div>
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Active Operator Sessions</h2>
            <Button variant="danger" size="sm" onClick={handleSignOutAll} className="text-xs">
              <LogOut className="w-3.5 h-3.5 mr-1" /> Terminate All Remote Sessions
            </Button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/70 rounded-lg border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Laptop className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-semibold text-white">Gangtok EOC Main Terminal (Current Session)</div>
                  <div className="text-slate-400 text-[11px]">IP: 103.24.12.8 • Chrome 129 on Windows 11</div>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">Active Now</Badge>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="font-semibold text-slate-300">GeoShield Field Tablet (SDRF Patrol)</div>
                  <div className="text-slate-500 text-[11px]">IP: 49.36.18.22 • Active 3h ago</div>
                </div>
              </div>
              <button className="text-red-400 hover:underline">Revoke</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "activity" && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Command Action Trail (Last 20 Operations)</h2>
          <div className="space-y-2">
            {RECENT_ACTIVITY.map((act) => (
              <div key={act.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white">{act.action}</div>
                  <div className="text-slate-400 text-[11px]">{act.detail}</div>
                </div>
                <span className="font-mono text-slate-500 text-[11px]">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}