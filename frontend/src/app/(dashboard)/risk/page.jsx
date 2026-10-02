"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ShieldAlert, Activity, Cpu, UserCheck } from "lucide-react";

export default function RiskPage() {
  const [humanOverride, setHumanOverride] = useState(null);

  const featureContributions = [
    { factor: "Rainfall Precipitation Rate", contribution: "+31%", value: "74 mm / 6h (Open-Meteo)" },
    { factor: "Soil Saturation & Pore Water", contribution: "+24%", value: "94.2% Peak Pressure" },
    { factor: "Steep Slope Terrain Physics", contribution: "+18%", value: "38° Incline Vector" },
    { factor: "Ground Truth Field Reports", contribution: "+14%", value: "3 Verified Incident Observations" },
    { factor: "Historical Landslide Recurrence", contribution: "+13%", value: "Monsoon Cycle Return Period" },
  ];

  const dataQualitySources = [
    { source: "Rainfall Telemetry (Open-Meteo)", status: "Good", fresh: "Updated 08:31 IST • Live" },
    { source: "Satellite Synthetic Aperture Radar", status: "Good", fresh: "Captured 07:55 IST" },
    { source: "Ground Transport Sensors", status: "Stale", fresh: "Updated 44m ago • Network Lag" },
    { source: "Field Officer Reports", status: "Limited", fresh: "3 Verified Reports" },
  ];

  const handleOverride = (level) => {
    setHumanOverride({
      level,
      operator: "Cmdr. Sharma",
      time: "08:45 IST",
      reason: "Field inspection confirms active debris movement exceeding satellite sensor resolution.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">AI Multi-Hazard Risk Assessment</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Explainable ML risk model output, feature attribution breakdown, source quality ratings, and human override interface.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge color="red">Model Score: 82 / 100</Badge>
          <Badge color="blue">Ensemble Confidence: 87%</Badge>
        </div>
      </div>

      {/* Primary Risk & Explanation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Gauge & Human Override */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Sector Risk</span>
              <span className="text-[11px] text-slate-500 font-mono">Model v3.4.1</span>
            </div>

            <div className="text-center py-4 space-y-1">
              <p className="text-5xl font-extrabold text-red-400 tracking-tight">82 <span className="text-sm font-normal text-slate-500">/ 100</span></p>
              <p className="text-xs font-bold text-white uppercase tracking-wider">HIGH RISK LEVEL</p>
              <p className="text-[11px] text-amber-400 font-medium">↑ 11 points since 06:00 IST</p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-slate-200">Potential Consequences:</p>
              <p className="text-slate-400 text-[11px]">≈ 18,400 people exposed • 2 road corridors restricted • 1 medical clinic in risk buffer zone</p>
            </div>
          </div>

          {/* Human Override Panel */}
          <div className="border-t border-slate-800 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-400" />
                Human Override Control
              </span>
              {humanOverride && <Badge color="yellow">Manual Override Active</Badge>}
            </div>

            {humanOverride ? (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs space-y-1 text-amber-300">
                <p className="font-bold">⚠ Override Applied: {humanOverride.level}</p>
                <p className="text-[11px] text-slate-300">Changed by {humanOverride.operator} at {humanOverride.time}</p>
                <p className="text-[11px] text-slate-400 italic">{humanOverride.reason}</p>
                <button
                  onClick={() => setHumanOverride(null)}
                  className="text-[11px] font-bold text-blue-400 underline pt-1"
                >
                  Reset to Model Recommendation
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => handleOverride("CRITICAL")} variant="danger" className="w-full text-xs">
                  Override to CRITICAL
                </Button>
                <Button onClick={() => handleOverride("MODERATE")} variant="secondary" className="w-full text-xs">
                  Downgrade
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Feature Contribution Breakdown */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Model Feature Contribution &amp; Explainability
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Primary factors driving the current 82 HIGH risk assessment.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-semibold">Model Confidence 87%</span>
          </div>

          <div className="space-y-3">
            {featureContributions.map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs gap-4">
                <div className="space-y-0.5">
                  <p className="font-semibold text-slate-200">{item.factor}</p>
                  <p className="text-[11px] text-slate-400">{item.value}</p>
                </div>
                <span className="font-mono font-bold text-red-400 bg-red-500/10 px-2.5 py-1 rounded border border-red-500/20 shrink-0">
                  {item.contribution}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Quality vs Model Confidence */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Input Telemetry Data Quality Ratings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Assessing data feed health independently from ML model confidence.
            </p>
          </div>
          <Badge color="green">Overall Data Quality: Good</Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {dataQualitySources.map((ds, idx) => (
            <div key={idx} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200 truncate">{ds.source}</span>
                <Badge color={ds.status === "Good" ? "green" : ds.status === "Stale" ? "yellow" : "blue"}>
                  {ds.status}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{ds.fresh}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}