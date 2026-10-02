"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { TrendingUp, CloudRain, AlertTriangle, Info } from "lucide-react";

export default function ForecastPage() {
  const [timeRange, setTimeRange] = useState("24h");
  const [region, setRegion] = useState("KTM-NORTH");

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Weather-Linked Predictive Risk Forecast</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Ensemble physics &amp; satellite precipitation models predicting slope stability window and road blockage risk.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time Range Toggle */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {["24h", "7d", "30d"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  timeRange === r ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="KTM-NORTH">Kathmandu North (High Risk)</option>
            <option value="PKR-EAST">Pokhara Basin (Moderate Risk)</option>
            <option value="SYN-WEST">Sindhupalchok (Critical Watch)</option>
          </select>
        </div>
      </div>

      {/* Expected Impacts Summary Panel */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 p-5 rounded-xl space-y-2">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>Expected Operational Impacts Takeaway</span>
        </div>
        <p className="text-sm font-semibold text-slate-100">
          Heavy monsoon cell expected to deposit <strong className="text-amber-300">185mm rainfall</strong> over the next 24 hours.
          Slope failure probability peaks between <strong className="text-red-400">18:00 - 24:00 IST</strong>. 3 road corridors (including R-17) are likely to be blocked by Saturday morning.
        </p>
      </div>

      {/* Forecast Visualization Panels with Confidence Bands */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Precipitation Forecast Curve */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              Precipitation Accumulation (mm)
            </h3>
            <Badge color="blue">Confidence Band 92%</Badge>
          </div>
          <div className="h-56 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-xs text-slate-500">
            [Interactive Precipitation &amp; Upper/Lower Confidence Shading Curve]
          </div>
        </div>

        {/* Soil Saturation & Landslide Probability */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center text-xs">
            <h3 className="font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-400" />
              Predictive Landslide Risk Index (0-100)
            </h3>
            <Badge color="red">Peak Risk Horizon: 18:00 IST</Badge>
          </div>
          <div className="h-56 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-xs text-slate-500">
            [Ensemble Model Forecast Curve &amp; Risk Threshold Lines]
          </div>
        </div>
      </div>

      {/* Data Attribution Footer */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center justify-between flex-wrap gap-2">
        <span className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-slate-500" />
          Model attribution: Open-Meteo GFS Ensemble • Sentinel-2 SAR • Local Rain Gauge Telemetry
        </span>
        <span className="font-mono text-[11px] text-slate-500">Generated 08:32 IST • Valid thru 20:32 IST</span>
      </div>
    </div>
  );
}