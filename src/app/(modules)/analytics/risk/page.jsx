"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Calendar, 
  Filter, 
  Layers, 
  Download, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  Info,
  Flame,
  Waves,
  Mountain,
  AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const TIME_SERIES_DATA = [
  { week: "W1 Jul", northern: 35, western: 40, eastern: 20, catchment: 15, event: null },
  { week: "W2 Jul", northern: 42, western: 55, eastern: 25, catchment: 22, event: null },
  { week: "W3 Jul", northern: 78, western: 68, eastern: 35, catchment: 40, event: "Monsoon Surge Peak" },
  { week: "W4 Jul", northern: 88, western: 72, eastern: 48, catchment: 60, event: null },
  { week: "W1 Aug", northern: 92, western: 85, eastern: 62, catchment: 75, event: "Flash Flood Event Alpha" },
  { week: "W2 Aug", northern: 65, western: 70, eastern: 50, catchment: 55, event: null },
  { week: "W3 Aug", northern: 58, western: 62, eastern: 44, catchment: 48, event: null },
  { week: "W4 Aug", northern: 70, western: 80, eastern: 52, catchment: 64, event: "Teesta Cloudburst Wave" },
  { week: "W1 Sep", northern: 82, western: 91, eastern: 68, catchment: 80, event: "Western Slope Slip" },
  { week: "W2 Sep", northern: 74, western: 82, eastern: 59, catchment: 71, event: null },
  { week: "W3 Sep", northern: 60, western: 65, eastern: 40, catchment: 45, event: null },
  { week: "W4 Sep", northern: 52, western: 58, eastern: 32, catchment: 38, event: null },
];

const MONTHLY_HEATMAP = [
  { region: "Northern Sikkim (Sector 4)", jun: 42, jul: 86, aug: 71, sep: 67, oct: 38 },
  { region: "Western Ridge (Pass 9)", jun: 48, jul: 74, aug: 74, sep: 74, oct: 41 },
  { region: "Eastern Valley (Lowlands)", jun: 22, jul: 43, aug: 52, sep: 50, oct: 28 },
  { region: "Upper Catchment Zone", jun: 30, jul: 59, aug: 60, sep: 59, oct: 34 },
];

export default function HistoricalRiskAnalyticsPage() {
  const [dateRange, setDateRange] = useState("90d");
  const [hazardFilter, setHazardFilter] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [compareMode, setCompareMode] = useState(false);
  const [compareRegion, setCompareRegion] = useState("Western Ridge (Pass 9)");

  const getHeatmapColor = (val) => {
    if (val >= 80) return "bg-red-500/80 text-white font-bold";
    if (val >= 65) return "bg-orange-500/70 text-white font-semibold";
    if (val >= 50) return "bg-amber-500/60 text-slate-900 font-semibold";
    if (val >= 35) return "bg-blue-500/40 text-slate-100";
    return "bg-slate-800 text-slate-400";
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/analytics" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Analytics Hub
        </Link>
        <span>/</span>
        <span className="text-slate-200">Historical Risk Analysis</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
              Historical Risk Analytics & Trends
            </h1>
            <Badge variant="outline" className="text-xs">
              90-Day Longitudinal
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Retrospective time-series modeling of vulnerability scores, monsoon anomalies, and event thresholds.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              compareMode 
                ? "bg-purple-500/20 border-purple-500/40 text-purple-300" 
                : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            {compareMode ? "✓ Compare Mode Active" : "Enable Compare Mode"}
          </button>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export Data (CSV)
          </Button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Time Horizon</label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="30d">Last 30 Days (Recent Surge)</option>
            <option value="90d">Last 90 Days (Full Monsoon Season)</option>
            <option value="180d">Last 180 Days (Semi-Annual)</option>
            <option value="365d">Last 365 Days (Annual Baseline)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Hazard Mechanism</label>
          <select 
            value={hazardFilter}
            onChange={(e) => setHazardFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Compound Hazards</option>
            <option value="flood">Flash Floods & Inundation</option>
            <option value="landslide">Debris Flow & Landslides</option>
            <option value="rain">Extreme Precipitation & Cloudburst</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Primary Region Focus</label>
          <select 
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white outline-none focus:border-blue-500"
          >
            <option value="all">All Monitored Regions (Overlay)</option>
            <option value="Northern Sikkim (Sector 4)">Northern Sikkim (Sector 4)</option>
            <option value="Western Ridge (Pass 9)">Western Ridge (Pass 9)</option>
            <option value="Eastern Valley (Lowlands)">Eastern Valley (Lowlands)</option>
            <option value="Upper Catchment Zone">Upper Catchment Zone</option>
          </select>
        </div>

        {compareMode && (
          <div>
            <label className="block text-[10px] font-semibold text-purple-400 uppercase mb-1">Benchmark Comparison</label>
            <select 
              value={compareRegion}
              onChange={(e) => setCompareRegion(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-purple-500/40 rounded-md text-xs text-purple-200 outline-none focus:border-purple-400"
            >
              <option value="Western Ridge (Pass 9)">Western Ridge (Pass 9)</option>
              <option value="Northern Sikkim (Sector 4)">Northern Sikkim (Sector 4)</option>
              <option value="Eastern Valley (Lowlands)">Eastern Valley (Lowlands)</option>
              <option value="Historical 5-Yr Baseline">Historical 5-Yr Baseline</option>
            </select>
          </div>
        )}
      </div>

      {/* Main Multi-Line Risk Trend Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-white">Longitudinal Multi-Region Risk Trajectory</h2>
            <p className="text-xs text-slate-400">Composite vulnerability index (0–100) plotted across weekly intervals with major incident markers.</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Northern
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Western
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Eastern
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Catchment
            </span>
          </div>
        </div>

        {/* Visual Simulated Time Series Canvas */}
        <div className="space-y-2 pt-2">
          <div className="h-64 flex items-end gap-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 relative overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-dashed border-red-500 w-full flex justify-between text-[10px] text-red-400">
                <span>Severe Threshold (80)</span>
              </div>
              <div className="border-b border-slate-700 w-full flex justify-between text-[10px] text-slate-500">
                <span>Moderate (50)</span>
              </div>
              <div className="border-b border-slate-800 w-full text-[10px] text-slate-600">
                <span>Baseline (20)</span>
              </div>
            </div>

            {/* Weekly Bars / Indicators */}
            {TIME_SERIES_DATA.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                {/* Event Marker Flag */}
                {item.event && (
                  <div className="absolute -top-1 z-10 hidden group-hover:flex flex-col items-center">
                    <div className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap font-medium">
                      ⚠️ {item.event}
                    </div>
                    <div className="w-1.5 h-1.5 bg-red-500 rotate-45 -mt-0.5" />
                  </div>
                )}
                {item.event && (
                  <div className="w-2 h-2 rounded-full bg-red-500 mb-1 animate-ping" title={item.event} />
                )}

                {/* Multibar cluster for the week */}
                <div className="w-full flex items-end justify-center gap-0.5 h-full pb-2">
                  <div 
                    style={{ height: `${item.northern}%` }} 
                    className="w-1.5 sm:w-2 bg-blue-500 rounded-t opacity-90 group-hover:opacity-100 transition-all"
                    title={`Northern: ${item.northern}`}
                  />
                  <div 
                    style={{ height: `${item.western}%` }} 
                    className="w-1.5 sm:w-2 bg-amber-500 rounded-t opacity-90 group-hover:opacity-100 transition-all"
                    title={`Western: ${item.western}`}
                  />
                  <div 
                    style={{ height: `${item.eastern}%` }} 
                    className="w-1.5 sm:w-2 bg-emerald-500 rounded-t opacity-90 group-hover:opacity-100 transition-all"
                    title={`Eastern: ${item.eastern}`}
                  />
                  <div 
                    style={{ height: `${item.catchment}%` }} 
                    className="w-1.5 sm:w-2 bg-purple-500 rounded-t opacity-90 group-hover:opacity-100 transition-all"
                    title={`Catchment: ${item.catchment}`}
                  />
                </div>

                <span className="text-[10px] text-slate-500 font-mono mt-1">{item.week}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Region × Month Average Risk Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div>
          <h3 className="text-base font-semibold text-white">Monthly Risk Intensity Matrix</h3>
          <p className="text-xs text-slate-400">Mean monthly composite index highlighting peak monsoon vulnerability windows.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 font-medium">Monitored Region</th>
                <th className="py-2.5 px-3 text-center">June 2026</th>
                <th className="py-2.5 px-3 text-center">July 2026 (Surge)</th>
                <th className="py-2.5 px-3 text-center">August 2026 (Peak)</th>
                <th className="py-2.5 px-3 text-center">September 2026</th>
                <th className="py-2.5 px-3 text-center">October 2026 (Forecast)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {MONTHLY_HEATMAP.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-medium text-white">{row.region}</td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded ${getHeatmapColor(row.jun)} font-mono`}>{row.jun}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded ${getHeatmapColor(row.jul)} font-mono`}>{row.jul}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded ${getHeatmapColor(row.aug)} font-mono`}>{row.aug}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded ${getHeatmapColor(row.sep)} font-mono`}>{row.sep}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2.5 py-1 rounded ${getHeatmapColor(row.oct)} font-mono`}>{row.oct}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}