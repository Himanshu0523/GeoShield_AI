"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, ShieldAlert, Radio, Search } from "lucide-react";

export default function Topbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }) + " IST"
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 z-20">
      {/* Left: Command Context & Real-time Clock */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
              National Disaster Command Center
            </h2>
            <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
              LEVEL 3 EMERGENCY
            </span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
            <span>Central Risk Engine v3.4</span>
            <span>•</span>
            <span className="font-mono text-slate-300">{time || "08:45:00 IST"}</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-medium">
              <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
              Telemetry Synchronized
            </span>
          </p>
        </div>
      </div>

      {/* Right: Actions & Operator Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="Search sector, road corridor, or alert ID..."
            className="w-64 bg-slate-950/70 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
        </div>

        <Link
          href="/notifications"
          className="relative p-1.5 text-slate-400 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
        </Link>

        <Link href="/profile" className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            OP
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-200 leading-tight">Cmdr. Sharma</p>
            <p className="text-[10px] text-slate-400 leading-tight">Duty Officer</p>
          </div>
        </Link>
      </div>
    </header>
  );
}