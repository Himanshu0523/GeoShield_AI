"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { FileText, MapPin, CheckCircle2, Wifi, Clock, UserCheck } from "lucide-react";

export default function FieldReportsPage() {
  const [reports, setReports] = useState([
    {
      id: "FR-101",
      reporter: "Inspector K. Sharma",
      role: "Field Inspector",
      region: "Kathmandu North (KM 42)",
      hazardType: "LANDSLIDE",
      severity: "CRITICAL",
      status: "VERIFIED",
      timestamp: "08:27 IST • 18m ago",
      notes: "Active debris flow blocking dual lanes. Slope displacement observed along upper ridge.",
      lat: 27.785,
      lng: 85.342,
      synced: true,
    },
    {
      id: "FR-102",
      reporter: "Vol. T. Gurung",
      role: "Volunteer Patrol",
      region: "Melamchi Valley Sector",
      hazardType: "FLASH_FLOOD",
      severity: "HIGH",
      status: "PENDING",
      timestamp: "08:10 IST • 35m ago",
      notes: "River level rising 0.5m/hr. Village perimeter embankment breached near bridge.",
      lat: 27.830,
      lng: 85.570,
      synced: true,
    },
  ]);

  const [region, setRegion] = useState("");
  const [notes, setNotes] = useState("");
  const [severity, setSeverity] = useState("HIGH");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!region || !notes) return;
    const newReport = {
      id: `FR-${Date.now().toString().slice(-3)}`,
      reporter: "Field Officer (You)",
      role: "Duty Inspector",
      region,
      hazardType: "SLOPE_MOVEMENT",
      severity,
      status: "PENDING",
      timestamp: "Just now",
      notes,
      lat: 27.717,
      lng: 85.324,
      synced: true,
    };
    setReports([newReport, ...reports]);
    setRegion("");
    setNotes("");
  };

  const handleVerify = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "VERIFIED" } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Offline Sync Banner */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Ground Truth Field Observations</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspector observations feed directly into AI risk model validation and evacuation routing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 font-medium">
            <Wifi className="w-3.5 h-3.5" />
            Online • Synced
          </span>
        </div>
      </div>

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Log Observation Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Log Field Observation
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Auto GPS-tagged &amp; timestamped</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Sector / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kathmandu North (KM 42)"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Observed Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="CRITICAL">CRITICAL — Debris Flow / Breach</option>
                <option value="HIGH">HIGH — Slope Movement</option>
                <option value="MODERATE">MODERATE — Minor Siltation</option>
                <option value="LOW">LOW — Routine Check</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Field Notes &amp; Evidence *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe slope displacement, water height, or road blockage..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full text-xs">
              Log Field Observation
            </Button>
          </form>
        </div>

        {/* Submitted Field Logs */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Submitted Ground Truth Logs
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {reports.length} total logs logged for AI verification
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Badge color={r.severity === "CRITICAL" ? "red" : "orange"}>
                      {r.severity}
                    </Badge>
                    <span className="font-mono font-bold text-slate-200">{r.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-semibold">{r.region}</span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.timestamp}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed">{r.notes}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                    {r.reporter} ({r.role})
                    {r.lat && r.lng && (
                      <span className="text-cyan-400 font-mono">📍 {r.lat}, {r.lng}</span>
                    )}
                  </span>

                  {r.status === "VERIFIED" ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      ✓ Integrated into ML Model
                    </span>
                  ) : (
                    <Button onClick={() => handleVerify(r.id)} variant="secondary" className="text-[11px] py-1">
                      Verify Report
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}