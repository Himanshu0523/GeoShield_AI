"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Search, ArrowLeft, Map, Activity, ShieldAlert, Home } from "lucide-react";
import Button from "@/components/ui/Button";

export default function GlobalNotFoundPage() {
  const [search, setSearch] = useState("");

  const TOP_LINKS = [
    { title: "Situation Overview", href: "/", icon: Home },
    { title: "Live GIS Cockpit", href: "/map", icon: Map },
    { title: "Alert Wire", href: "/alerts", icon: ShieldAlert },
    { title: "Risk Matrix", href: "/risk", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: "12s" }} />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider">
            HTTP 404 • Unmapped Coordinate
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            This Road Leads Nowhere
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The requested corridor or operational endpoint was not found on our GIS grid.
          </p>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input 
            type="text"
            placeholder="Search operational modules or corridors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Recommended Links */}
        <div className="space-y-2 text-left">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            Navigational Corridors:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TOP_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800">
          <Link href="/">
            <Button variant="primary" className="w-full flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Command Center
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}