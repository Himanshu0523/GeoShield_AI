import React from "react";
import { Radio } from "lucide-react";

export default function GlobalLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Radar scanning sweep visual */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping opacity-40" />
        <div className="absolute inset-4 rounded-full border border-blue-500/30" />
        <div className="absolute inset-12 rounded-full border border-blue-500/40" />
        <div className="absolute inset-20 rounded-full border border-blue-500/60" />
        
        {/* Sweeping radar needle */}
        <div className="absolute w-24 h-0.5 bg-gradient-to-r from-transparent to-blue-400 origin-left animate-spin" style={{ animationDuration: "2.5s" }} />

        {/* Center dot */}
        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" />
      </div>

      <div className="text-center space-y-2 max-w-sm">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
          <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>Synchronizing Telemetry Feeds</span>
        </div>
        <p className="text-xs text-slate-400">
          Connecting to GIS layers, IoT slopemeters, and IMD Doppler radar stream...
        </p>
      </div>

      {/* Background ambient layout skeleton */}
      <div className="absolute inset-x-8 bottom-8 opacity-20 pointer-events-none hidden md:grid grid-cols-4 gap-4">
        <div className="h-24 bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-800 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-800 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}