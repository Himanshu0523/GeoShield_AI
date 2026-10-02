import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
  ShieldAlert,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  Clock,
  Eye
} from "lucide-react";

export default function HomePage() {
  const situationSummary = {
    district: "NORTH DISTRICT & HELAMBU CORRIDOR",
    riskLevel: "HIGH RISK (82 / 100)",
    lastAssessment: "08:42 IST · 3 min ago",
    deltas: [
      { label: "Flood Risk", value: "+18%", color: "text-red-400" },
      { label: "Precipitation Rate", value: "+34%", color: "text-orange-400" },
      { label: "Road Access Index", value: "-12%", color: "text-amber-400" },
      { label: "Ground Truth Reports", value: "+3 Verified", color: "text-emerald-400" },
    ],
  };

  const decisionItems = [
    {
      id: "ALT-20481",
      title: "Catastrophic Slope Failure Threat — Helambu Pass",
      severity: "CRITICAL",
      sector: "North District (KM 42)",
      exposure: "18,400 People Potentially Exposed",
      triggers: ["Rainfall 74mm/6h", "Pore Water Peak", "2 Nearby Debris Slides"],
      freshness: "Updated 4m ago • Live Radar",
      actionUrl: "/alerts",
      actionText: "Investigate Alert",
    },
    {
      id: "ROD-102",
      title: "Prithvi Highway Arterial Blockage at Mile Marker 104",
      severity: "HIGH",
      sector: "Pokhara Corridor",
      exposure: "Emergency Route Restricted",
      triggers: ["Single Lane Flag Control", "Excavator En Route"],
      freshness: "Last Confirmed 18m ago",
      actionUrl: "/roads",
      actionText: "Verify Route Access",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Situation Room Header & Awareness Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 z-10 relative">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-white tracking-tight">
                      SITUATION ROOM — LIVE DISASTER COMMAND
                    </h1>
                    <Badge color="red">CRITICAL WATCH</Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Integrated multi-hazard telemetry, AI landslide risk model v3.4, and arterial corridor status.
                  </p>
                </div>
              </div>

              {/* Situation Summary */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                <span className="font-semibold text-slate-300">
                  Target Sector: <strong className="text-white">{situationSummary.district}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-red-400 font-bold">
                  {situationSummary.riskLevel}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {situationSummary.lastAssessment}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link href="/map">
                <Button variant="primary" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Launch Interactive GIS Map
                </Button>
              </Link>
              <Link href="/priority">
                <Button variant="secondary" className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Priority Matrix
                </Button>
              </Link>
            </div>
          </div>

          {/* Delta Ticker: What Changed Since Last Assessment */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800/80">
            {situationSummary.deltas.map((d, i) => (
              <div key={i} className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium">{d.label}</p>
                <p className={`text-base font-bold mt-0.5 ${d.color}`}>{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Decision Density Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Critical Alerts</span>
              <Badge color="red">Immediate Action</Badge>
            </div>
            <p className="text-3xl font-extrabold text-white leading-none">4 <span className="text-xs font-medium text-red-400">Active</span></p>
            <p className="text-[11px] text-slate-400">2 Evacuation dispatches issued</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">High-Risk Sectors</span>
              <Badge color="orange">Elevated</Badge>
            </div>
            <p className="text-3xl font-extrabold text-white leading-none">12 <span className="text-xs font-medium text-orange-400">Monitored</span></p>
            <p className="text-[11px] text-slate-400">↑ +3 sectors since 06:00 IST</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Corridors Affected</span>
              <Badge color="yellow">Restricted</Badge>
            </div>
            <p className="text-3xl font-extrabold text-white leading-none">7 <span className="text-xs font-medium text-amber-400">Passable 82%</span></p>
            <p className="text-[11px] text-slate-400">R-17 &amp; NH-04 partially blocked</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Potentially Exposed</span>
              <Badge color="indigo">Human Scale</Badge>
            </div>
            <p className="text-3xl font-extrabold text-white leading-none">84K <span className="text-xs font-medium text-indigo-400">People</span></p>
            <p className="text-[11px] text-slate-400">Approx. population in risk zone</p>
          </div>
        </div>

        {/* What Needs Attention Now */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                WHAT NEEDS ATTENTION NOW
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Prioritized items requiring operator review, field verification, or dispatch acknowledgement.
              </p>
            </div>
            <Link href="/priority" className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1">
              View Full Priority Matrix <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {decisionItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <Badge color={item.severity === "CRITICAL" ? "red" : "orange"}>
                      {item.severity}
                    </Badge>
                    <span className="font-mono font-bold text-slate-200">{item.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-300 font-semibold">{item.sector}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.freshness}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    <span className="text-indigo-400 font-medium">{item.exposure}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-400">Triggers:</span>
                    {item.triggers.map((t, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 self-end md:self-center">
                  <Link href={item.actionUrl}>
                    <Button variant={item.severity === "CRITICAL" ? "danger" : "primary"} className="text-xs">
                      {item.actionText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}