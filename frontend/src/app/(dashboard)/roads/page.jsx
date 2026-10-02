"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Route, Search, Wrench } from "lucide-react";

const MOCK_ROADS = [
  { id: "R-17", name: "Tribhuvan Highway (NH-02)", segment: "Km 42 - Km 58", status: "BLOCKED", riskScore: 92, notes: "Major debris flow blocking dual lanes.", lastInspection: "08:31 IST • 14m ago" },
  { id: "R-04", name: "Prithvi Highway (NH-04)", segment: "Km 104 - Km 112", status: "PARTIALLY_BLOCKED", riskScore: 78, notes: "Single lane traffic under flag control due to rockfall.", lastInspection: "08:20 IST • 25m ago" },
  { id: "R-18", name: "BP Koirala Highway Pass", segment: "Km 18 - Km 30", status: "UNDER_REPAIR", riskScore: 65, notes: "Excavator team actively clearing mudflow.", lastInspection: "07:45 IST • 1h ago" },
  { id: "R-05", name: "Ring Road Bypass Sector", segment: "Kalanki - Balaju", status: "OPEN", riskScore: 12, notes: "Clear, normal operational flow.", lastInspection: "08:40 IST • 5m ago" },
];

export default function RoadsPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredRoads = MOCK_ROADS.filter((r) => {
    const matchesStatus = filter === "ALL" || r.status === filter;
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.segment.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & KPI Strip */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Road Connectivity &amp; Corridor Intelligence</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time accessibility monitoring across key highway arterial corridors and rescue bypass routes.
            </p>
          </div>
        </div>

        <Button variant="primary" className="text-xs flex items-center gap-1.5 shrink-0">
          <Wrench className="w-3.5 h-3.5" />
          Report Road Issue
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Passable Corridors</p>
          <p className="text-2xl font-extrabold text-emerald-400">88% <span className="text-xs font-normal text-slate-500">(14 Passable)</span></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blocked Corridors</p>
          <p className="text-2xl font-extrabold text-red-400">4 <span className="text-xs font-normal text-slate-500">(Severe)</span></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Partially Blocked</p>
          <p className="text-2xl font-extrabold text-amber-400">6 <span className="text-xs font-normal text-slate-500">(Restricted)</span></p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Clearance Crews</p>
          <p className="text-2xl font-extrabold text-blue-400">3 Crews <span className="text-xs font-normal text-slate-500">Deployed</span></p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search road corridor or segment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {["ALL", "BLOCKED", "PARTIALLY_BLOCKED", "UNDER_REPAIR", "OPEN"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-lg font-semibold text-[11px] border transition-all ${
                filter === st
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden text-xs text-slate-300">
        <table className="w-full text-left">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold">
            <tr>
              <th className="p-3">Corridor ID &amp; Name</th>
              <th className="p-3">Segment</th>
              <th className="p-3">Status</th>
              <th className="p-3">Risk Score</th>
              <th className="p-3">Inspection Notes</th>
              <th className="p-3 text-right">Last Survey</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredRoads.map((r) => (
              <tr key={r.id} className="hover:bg-slate-850/50 transition-colors">
                <td className="p-3">
                  <span className="font-mono font-bold text-blue-400 block">{r.id}</span>
                  <span className="font-semibold text-white">{r.name}</span>
                </td>
                <td className="p-3 font-mono text-slate-400">{r.segment}</td>
                <td className="p-3">
                  <Badge color={r.status === "BLOCKED" ? "red" : r.status === "PARTIALLY_BLOCKED" ? "orange" : r.status === "UNDER_REPAIR" ? "yellow" : "green"}>
                    {r.status}
                  </Badge>
                </td>
                <td className="p-3 font-bold text-red-400">{r.riskScore} / 100</td>
                <td className="p-3 text-slate-300 max-w-xs">{r.notes}</td>
                <td className="p-3 text-right font-mono text-slate-500">{r.lastInspection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}