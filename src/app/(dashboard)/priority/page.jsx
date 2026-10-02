import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { ListOrdered, HelpCircle } from "lucide-react";

const PRIORITIES = [
  {
    rank: 1,
    id: "PR-01",
    sector: "Sindhupalchok Helambu Corridor",
    taskName: "Issue Emergency Settlement Evacuation Directive",
    urgency: "URGENT EVACUATION",
    riskScore: 94,
    exposure: "3,200 villagers in debris path",
    whyPrioritized: [
      "Rapid risk score escalation (+22% in 2h)",
      "Soil moisture peak at 96% saturation",
      "2 verified slope movements reported by field inspectors",
      "Only 1 arterial exit route remaining open"
    ],
    lastUpdated: "08:40 IST • 4m ago",
    status: "ACTION REQUIRED"
  },
  {
    rank: 2,
    id: "PR-02",
    sector: "Prithvi Highway Corridor (KM 104)",
    taskName: "Dispatch Heavy Clearance Crew & Traffic Bypass",
    urgency: "CRITICAL CLEARANCE",
    riskScore: 88,
    exposure: "Key freight & medical corridor blocked",
    whyPrioritized: [
      "Major highway blocked across 300m stretch",
      "Emergency medical transport waiting on bypass",
      "High probability of secondary rockfall"
    ],
    lastUpdated: "08:35 IST • 9m ago",
    status: "DISPATCHED"
  },
  {
    rank: 3,
    id: "PR-03",
    sector: "Kathmandu North (Shivapuri Sector)",
    taskName: "Issue Heavy Transport Speed Warning & Crest Patrol",
    urgency: "ELEVATED MONITORING",
    riskScore: 78,
    exposure: "Main commuter pass",
    whyPrioritized: [
      "Continuous rainfall exceeding 180mm/24h threshold",
      "Pore water pressure increasing along northern slope"
    ],
    lastUpdated: "08:20 IST • 24m ago",
    status: "MONITORING"
  }
];

export default function PriorityPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">AI Action Priority Matrix</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-factor decision queue ranking disaster response tasks by risk escalation, population exposure, and asset urgency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge color="red">3 Critical Directives</Badge>
          <Badge color="blue">Auto-Ranked v3.4</Badge>
        </div>
      </div>

      {/* Priority Matrix List */}
      <div className="space-y-4">
        {PRIORITIES.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-extrabold text-sm flex items-center justify-center">
                  #{item.rank}
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge color={item.rank === 1 ? "red" : item.rank === 2 ? "orange" : "yellow"}>
                      {item.urgency}
                    </Badge>
                    <span className="text-xs font-mono font-bold text-slate-200">{item.id}</span>
                    <span className="text-slate-600 text-xs">•</span>
                    <span className="text-xs text-slate-300 font-semibold">{item.sector}</span>
                  </div>
                  <h2 className="text-sm font-bold text-white mt-1">{item.taskName}</h2>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Risk Score</p>
                  <p className="text-lg font-extrabold text-red-400 leading-none">{item.riskScore} <span className="text-xs font-normal text-slate-500">/ 100</span></p>
                </div>
                <Button variant={item.rank === 1 ? "danger" : "primary"} className="text-xs">
                  {item.status === "ACTION REQUIRED" ? "Execute Directive" : "Manage Task"}
                </Button>
              </div>
            </div>

            {/* Why This Is Prioritized */}
            <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 rounded-lg space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-blue-400">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why This Is Prioritized</span>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-slate-300 text-[11px]">
                {item.whyPrioritized.map((reason, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500">
                <span>Exposure: <strong className="text-indigo-400">{item.exposure}</strong></span>
                <span>{item.lastUpdated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}