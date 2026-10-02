"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Layers, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  FileText, 
  MapPin, 
  Share2,
  Sparkles,
  TrendingDown
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const INCIDENTS_DATA = [
  {
    id: "INC-2026-104",
    date: "Sep 28, 2026",
    type: "Landslide / Slope Failure",
    region: "Northern Sikkim (Sector 4)",
    roadSegment: "NH-10 Sector 4 (KM 42-45)",
    severity: "critical",
    responseTime: "22 mins",
    clearanceTime: "3.5 hrs",
    outcome: "Corridor Cleared / Reinforced Retaining Wall Scheduled",
    casualties: 0
  },
  {
    id: "INC-2026-099",
    date: "Sep 24, 2026",
    type: "Flash Flood / Inundation",
    region: "Eastern Valley (Lowlands)",
    roadSegment: "State Highway 3B (Low Bridge)",
    severity: "critical",
    responseTime: "18 mins",
    clearanceTime: "6.0 hrs",
    outcome: "Traffic Rerouted via East Bypass / Culvert Silt Purged",
    casualties: 0
  },
  {
    id: "INC-2026-091",
    date: "Sep 18, 2026",
    type: "Rockfall Hazard",
    region: "Western Ridge (Pass 9)",
    roadSegment: "Pass 9 Mountain Arterial (KM 18)",
    severity: "warning",
    responseTime: "35 mins",
    clearanceTime: "1.8 hrs",
    outcome: "Overhead Catch Nets Deployed / Resumed 20km/h Flow",
    casualties: 0
  },
  {
    id: "INC-2026-085",
    date: "Sep 12, 2026",
    type: "Mudflow / Debris Washout",
    region: "Northern Sikkim (Sector 4)",
    roadSegment: "NH-10 Sector 4 (KM 41-43)",
    severity: "warning",
    responseTime: "29 mins",
    clearanceTime: "4.2 hrs",
    outcome: "Heavy Excavator Deployment / Drainage Trench Dug",
    casualties: 0
  },
  {
    id: "INC-2026-079",
    date: "Sep 04, 2026",
    type: "Culvert Capacity Overtopping",
    region: "Upper Catchment Zone",
    roadSegment: "Access Road Sector 1",
    severity: "info",
    responseTime: "45 mins",
    clearanceTime: "1.2 hrs",
    outcome: "Silt De-clogged / No Structural Subgrade Damage",
    casualties: 0
  },
];

const DETECTED_CLUSTERS = [
  {
    id: "CLUST-01",
    title: "NH-10 KM 40–45 Landslide Vulnerability Cluster",
    count: "5 incidents in 60 days",
    pattern: "All incidents triggered when cumulative 72h rainfall exceeds 140mm on weathered schist slope.",
    recommendedAction: "Mandate soil nailing and rock bolt anchoring on slope face before next monsoon cycle.",
    urgency: "High Priority"
  },
  {
    id: "CLUST-02",
    title: "Eastern Valley Low-Bridge Inundation Choke Point",
    count: "3 bridge overtopping events",
    pattern: "Culvert discharge inadequate when upstream dam outflow exceeds 250 m³/s.",
    recommendedAction: "Elevate road carriage deck by 1.2m and widen drainage box culvert.",
    urgency: "Capital Improvement Plan"
  }
];

export default function IncidentForensicsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [exportNotice, setExportNotice] = useState(false);

  const filteredIncidents = INCIDENTS_DATA.filter((item) => {
    const matchesSearch = item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.roadSegment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type.toLowerCase().includes(typeFilter);
    const matchesSev = severityFilter === "all" || item.severity === severityFilter;
    return matchesSearch && matchesType && matchesSev;
  });

  const handleExport = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/analytics" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Analytics Hub
        </Link>
        <span>/</span>
        <span className="text-slate-200">Incident & Forensics Analysis</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-red-400" />
              Incident Forensics & Pattern Detection
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              Audit & Post-Mortem
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Systematic retrospective review of hazard disruptions, response latencies, and spatial recurring failure patterns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            {exportNotice ? "Generating Audit PDF..." : "Export Incident Audit Report"}
          </Button>
        </div>
      </div>

      {/* Metric Summaries Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Recorded Incidents</span>
          <div className="text-2xl font-bold text-white mt-1">28 Events</div>
          <div className="text-[11px] text-slate-500 mt-1">Past 90 days operational window</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Mean Response Latency</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            26.4 mins
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1">↓ 14% improvement over last quarter</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Mean Clearance Duration</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">3.1 Hours</div>
          <div className="text-[11px] text-slate-500 mt-1">From dispatch to corridor re-opening</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">High-Risk Spatial Clusters</span>
          <div className="text-2xl font-bold text-red-400 mt-1">2 Hotspots</div>
          <div className="text-[11px] text-red-400/80 mt-1">Recurring structural failures identified</div>
        </div>
      </div>

      {/* Recurrent Failure Clusters Panel */}
      <div className="bg-slate-900 border border-red-500/30 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold text-white">Automated Pattern Detection & Spatial Clusters</h2>
          </div>
          <span className="text-xs text-amber-400 font-mono">2 Machine-Identified Choke Points</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DETECTED_CLUSTERS.map((cluster) => (
            <div key={cluster.id} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">{cluster.id}</span>
                <Badge variant="warning" className="text-[10px]">{cluster.urgency}</Badge>
              </div>
              <h3 className="text-sm font-semibold text-white">{cluster.title}</h3>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-400">Observed Pattern:</strong> {cluster.pattern}
              </p>
              <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-300">
                <strong>Mitigation Directive:</strong> {cluster.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Incident Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search by corridor, region, or hazard..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select 
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Incident ID & Date</th>
                <th className="py-2.5 px-3">Hazard Type</th>
                <th className="py-2.5 px-3">Corridor & Region</th>
                <th className="py-2.5 px-3">Response</th>
                <th className="py-2.5 px-3">Clearance</th>
                <th className="py-2.5 px-3">Operational Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIncidents.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-mono text-white font-medium">{row.id}</div>
                    <div className="text-[11px] text-slate-500">{row.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-200 font-medium">{row.type}</span>
                    <div className="mt-0.5">
                      <Badge variant={row.severity === "critical" ? "danger" : "warning"} className="text-[10px]">
                        {row.severity}
                      </Badge>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-white font-medium">{row.roadSegment}</div>
                    <div className="text-[11px] text-slate-400">{row.region}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400">{row.responseTime}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{row.clearanceTime}</td>
                  <td className="py-3 px-3 text-slate-300 max-w-xs">{row.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}