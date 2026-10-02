"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  Activity, 
  FileText, 
  BarChart3, 
  Layers, 
  Download, 
  Plus, 
  Clock, 
  ArrowUpRight, 
  Sparkles, 
  ChevronRight,
  ShieldAlert,
  Search,
  CheckCircle2
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const ANALYSIS_MODULES = [
  {
    id: "risk-analytics",
    title: "Historical Risk Analytics",
    href: "/analytics/risk",
    description: "90-day multi-hazard time series, regional vulnerability matrix, and seasonal anomaly trends.",
    icon: TrendingUp,
    badge: "Model v2.4",
    lastUpdated: "12m ago",
    color: "from-blue-500/20 to-cyan-500/5 border-blue-500/30"
  },
  {
    id: "incidents-forensics",
    title: "Incident & Post-Mortem Forensics",
    href: "/analytics/incidents",
    description: "Cluster pattern recognition, road blockage post-mortems, and emergency response time distributions.",
    icon: Activity,
    badge: "14 Clusters Detected",
    lastUpdated: "45m ago",
    color: "from-red-500/20 to-orange-500/5 border-red-500/30"
  },
  {
    id: "climate-trends",
    title: "Catchment Trends & Forecasting",
    href: "/forecast",
    description: "Multi-model ensemble rainfall projections, river basin volume models, and 30-day saturation curves.",
    icon: Layers,
    badge: "IMD + ECMWF",
    lastUpdated: "2h ago",
    color: "from-emerald-500/20 to-teal-500/5 border-emerald-500/30"
  },
  {
    id: "priority-rankings",
    title: "Priority & Intervention Engine",
    href: "/priority",
    description: "Urgency × Impact algorithmic ranking queue for mitigation deployments and field teams.",
    icon: BarChart3,
    badge: "Active Queue",
    lastUpdated: "5m ago",
    color: "from-purple-500/20 to-pink-500/5 border-purple-500/30"
  }
];

const RECENT_REPORTS = [
  {
    id: "REP-2026-089",
    title: "Monsoon Surge Vulnerability & Corridor Disruption Audit",
    author: "Dr. K. Sharma (Chief Met Analyst)",
    date: "Sep 28, 2026",
    format: "PDF (14.2 MB)",
    status: "Published",
    category: "Quarterly Audit"
  },
  {
    id: "REP-2026-088",
    title: "Western Ridge Slopemeter Grid Telemetry Verification",
    author: "Geotechnical Bureau",
    date: "Sep 25, 2026",
    format: "GeoJSON + PDF",
    status: "Verified",
    category: "Sensor Calibration"
  },
  {
    id: "REP-2026-084",
    title: "Teesta Basin Flash Flood Response Time & Mitigation Analysis",
    author: "Disaster Ops Command",
    date: "Sep 20, 2026",
    format: "PDF (8.7 MB)",
    status: "Published",
    category: "Incident Review"
  }
];

export default function AnalyticsHubPage() {
  const [builderOpen, setBuilderOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handleDownload = (id) => {
    setDownloadSuccess(id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Analytics Hub & Intelligence
            </h1>
            <Badge variant="default" className="text-xs">
              Decision Support
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Deep retrospective analysis, predictive modeling, incident pattern discovery, and audit synthesis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => setBuilderOpen(true)}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            New Custom Analysis
          </Button>
        </div>
      </div>

      {/* Primary Analytics Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ANALYSIS_MODULES.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.id} 
              href={item.href}
              className={`p-5 rounded-xl border bg-gradient-to-br ${item.color} bg-slate-900/60 hover:bg-slate-900 hover:border-slate-600 transition-all group relative overflow-hidden`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-slate-800/80 text-white border border-slate-700">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] text-slate-300">
                    {item.badge}
                  </Badge>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> Updated {item.lastUpdated}
                </span>
                <span className="text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Launch Engine <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Intelligence Reports */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Intelligence & Audit Reports</h2>
            <p className="text-xs text-slate-400">Formal post-incident and quarterly risk dossiers generated for command stakeholders.</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">3 Available</span>
        </div>

        <div className="space-y-3">
          {RECENT_REPORTS.map((report) => (
            <div 
              key={report.id}
              className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300 mt-0.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{report.id}</span>
                    <Badge variant="outline" className="text-[10px]">{report.category}</Badge>
                  </div>
                  <h4 className="text-sm font-medium text-white mt-1">{report.title}</h4>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                    <span>{report.author}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-400">{report.format}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDownload(report.id)}
                  className="text-xs flex items-center gap-1.5"
                >
                  {downloadSuccess === report.id ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Exported</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Export Dossier
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Analysis Builder Modal */}
      {builderOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-bold text-white">Configure Custom Analysis</h2>
              </div>
              <button onClick={() => setBuilderOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Analysis Focus</label>
                <select className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 outline-none">
                  <option>Road Blockage & Culvert Vulnerability Correlation</option>
                  <option>Slope Failure vs Rainfall Intensity Threshold Curves</option>
                  <option>Multi-Region Evacuation Route Survivability</option>
                  <option>Inter-Agency Response Latency Benchmark</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Time Horizon</label>
                  <select className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 outline-none">
                    <option>Last 30 Days</option>
                    <option>Last 90 Days</option>
                    <option>Last 365 Days (Full Monsoon)</option>
                    <option>Custom Range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Output Synthesis</label>
                  <select className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-blue-500 outline-none">
                    <option>Executive PDF Briefing</option>
                    <option>Interactive Time Series</option>
                    <option>Raw Telemetry CSV/JSON</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
                Analysis will synthesize machine learning model inferences across IMD Doppler feeds, NHAI traffic logs, and IoT slopemeters.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setBuilderOpen(false)}>Cancel</Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setBuilderOpen(false);
                  alert("Custom analysis job dispatched to analytics worker cluster. Results will be ready shortly.");
                }}
              >
                Generate Analysis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}