import Link from "next/link";
import { ShieldAlert, Shield } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans overflow-hidden">
      {/* Left Panel: Brand & Mission Brief (Split Screen) */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800/80 select-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              GeoShield<span className="text-cyan-400 font-bold">.AI</span>
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
              National Disaster Command Engine
            </p>
          </div>
        </div>

        {/* Central Mission Statement & Radar Pulse */}
        <div className="z-10 space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            OPERATIONAL SECURITY GATE
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
            Real-time Geo-Spatial Risk &amp; Road Intelligence Platform
          </h2>

          <p className="text-sm text-slate-400 leading-relaxed">
            Multi-hazard telemetry ingestion, AI slope instability models, and live corridor accessibility tracking for emergency management operators.
          </p>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 backdrop-blur-md">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Telemetry Feeds Connected</span>
              <span className="text-emerald-400 font-bold">99.8% Active</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full w-[99.8%]" />
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="z-10 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
          <span>GeoShield AI v3.4.1 • Restrictive Access</span>
          <span>Authorized Personnel Only</span>
        </div>
      </div>

      {/* Right Panel: Auth Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}