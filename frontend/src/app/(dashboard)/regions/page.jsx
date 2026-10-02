"use client";

import { useState } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { Shield, Search, LayoutGrid, List } from "lucide-react";

const REGIONS = [
  {
    id: "KTM-NORTH",
    name: "Kathmandu North (Shivapuri Sector)",
    riskScore: 88,
    severity: "CRITICAL",
    population: "124,821 Exposed",
    alertsCount: 4,
    roadsAffected: 2,
    trend: "+14% this week",
    lastAssessment: "08:35 IST",
  },
  {
    id: "PKR-EAST",
    name: "Pokhara Basin & Seti Gorge",
    riskScore: 62,
    severity: "HIGH",
    population: "85,400 Exposed",
    alertsCount: 2,
    roadsAffected: 1,
    trend: "+6% this week",
    lastAssessment: "08:20 IST",
  },
  {
    id: "TRH-SOUTH",
    name: "Terai Southern Corridor",
    riskScore: 28,
    severity: "LOW",
    population: "210,000 Monitored",
    alertsCount: 0,
    roadsAffected: 0,
    trend: "-4% this week",
    lastAssessment: "08:00 IST",
  },
  {
    id: "SYN-WEST",
    name: "Sindhupalchok Helambu Sector",
    riskScore: 94,
    severity: "CRITICAL",
    population: "18,400 Exposed",
    alertsCount: 5,
    roadsAffected: 3,
    trend: "+28% this week",
    lastAssessment: "08:42 IST",
  }
];

export default function RegionsPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const filteredRegions = REGIONS.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchesSev = severityFilter === "ALL" || r.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Monitored Geographical Sectors</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Roster of monitored administrative regions, terrain sectors, and population exposure indexes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge color="blue">{REGIONS.length} Active Sectors</Badge>
        </div>
      </div>

      {/* Filter Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search region name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>

          <div className="flex gap-1">
            {["ALL", "CRITICAL", "HIGH", "LOW"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                  severityFilter === sev
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 border border-slate-800 p-0.5 rounded-lg bg-slate-950">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md ${viewMode === "grid" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md ${viewMode === "table" ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRegions.map((r) => (
            <Link
              key={r.id}
              href={`/regions/${r.id}`}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color={r.severity === "CRITICAL" ? "red" : r.severity === "HIGH" ? "orange" : "green"}>
                      {r.severity}
                    </Badge>
                    <span className="font-mono text-xs font-bold text-slate-400">{r.id}</span>
                  </div>
                  <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {r.name}
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-500">Risk Index</p>
                  <p className="text-2xl font-extrabold text-red-400">{r.riskScore}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>{r.population}</span>
                <span className="text-amber-400 font-semibold">{r.alertsCount} Active Alerts</span>
                <span className="font-mono text-[11px] text-slate-500">{r.lastAssessment}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-xs text-slate-300">
          <table className="w-full text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold">
              <tr>
                <th className="p-3">Sector Name</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Exposure</th>
                <th className="p-3">Alerts</th>
                <th className="p-3 text-right">Last Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRegions.map((r) => (
                <tr key={r.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="p-3 font-semibold text-white">
                    <Link href={`/regions/${r.id}`} className="hover:text-blue-400">
                      {r.name}
                    </Link>
                  </td>
                  <td className="p-3">
                    <Badge color={r.severity === "CRITICAL" ? "red" : "green"}>{r.severity}</Badge>
                  </td>
                  <td className="p-3 font-bold text-red-400">{r.riskScore}</td>
                  <td className="p-3 text-slate-400">{r.population}</td>
                  <td className="p-3 text-amber-400">{r.alertsCount}</td>
                  <td className="p-3 text-right font-mono text-slate-500">{r.lastAssessment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}