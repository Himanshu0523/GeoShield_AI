"use client";

import { use, useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { ArrowLeft, AlertTriangle } from "lucide-react";

export default function RegionDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const regionId = params?.id || "KTM-NORTH";
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/regions" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Regions</span>
        </Link>
        <span>/</span>
        <span className="text-slate-200 font-mono font-bold">{regionId}</span>
      </div>

      {/* Hero Dossier Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge color="red">CRITICAL RISK</Badge>
              <span className="text-xs font-mono font-bold text-slate-400">{regionId}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Kathmandu North (Shivapuri Sector)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Elevated slope displacement risk, high monsoon precipitation, and restricted corridor pass.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Composite Risk Score</p>
              <p className="text-2xl font-extrabold text-red-400">88 <span className="text-xs text-slate-500 font-normal">/ 100</span></p>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Exposed Population</p>
              <p className="text-lg font-bold text-white">124,821</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 text-xs gap-6 pt-2">
          {["overview", "alerts", "roads", "reports", "forecast"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 capitalize font-semibold transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Top Hazards */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider text-slate-400">Primary Hazard Triggers</h3>
              <div className="space-y-2">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">Debris Flow &amp; Slope Displacement</p>
                    <p className="text-[11px] text-slate-400">Pore water saturation at 94.2%</p>
                  </div>
                  <Badge color="red">+31% Contribution</Badge>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">Rainfall Precipitation Exceedance</p>
                    <p className="text-[11px] text-slate-400">185mm / 24h accumulation</p>
                  </div>
                  <Badge color="orange">+24% Contribution</Badge>
                </div>
              </div>
            </div>

            {/* Embedded Mini-Map Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-white">Geographic Sector GIS Preview</h3>
              <div className="h-64 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-xs text-slate-500">
                [Sector Boundary &amp; Active Corridor GIS Preview]
              </div>
            </div>
          </div>

          {/* Right Rail: Active Alerts & Reports */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Active Directives (4)
              </h3>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="font-bold text-slate-200">Helambu Settlement Evacuation</p>
                  <p className="text-[11px] text-slate-400">10m ago • Critical</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <p className="font-bold text-slate-200">Shivapuri Crest Patrol Warning</p>
                  <p className="text-[11px] text-slate-400">25m ago • High</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}