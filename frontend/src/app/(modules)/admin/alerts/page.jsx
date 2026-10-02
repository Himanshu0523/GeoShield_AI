"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BellRing, 
  Plus, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Sliders, 
  FileText, 
  Send, 
  Zap, 
  X,
  Radio
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const INITIAL_RULES = [
  {
    id: "RULE-01",
    name: "River Gauge Critical Exceedance",
    trigger: "Water Level > 1.8m above datum OR Rate of Rise > 0.4m/hr",
    severity: "critical",
    recipients: "SDRF Control, District Collector, Public Siren Grid",
    active: true
  },
  {
    id: "RULE-02",
    name: "Slopemeter Geotechnical Shear Alert",
    trigger: "Displacement > 35mm in 15min on any Class-A slope sensor",
    severity: "critical",
    recipients: "NHAI Highway Patrol, Emergency Excavator Dispatch",
    active: true
  },
  {
    id: "RULE-03",
    name: "Radar Cloudburst Pre-Warning",
    trigger: "IMD Doppler Reflectivity > 50 dBZ for > 30 consecutive minutes",
    severity: "warning",
    recipients: "Met Duty Desk, Regional EOC Operations",
    active: true
  },
  {
    id: "RULE-04",
    name: "Culvert Capacity High-Water Advisory",
    trigger: "Field Report confirms silt accumulation > 70% capacity",
    severity: "info",
    recipients: "Municipal Maintenance Squad",
    active: false
  }
];

const TEMPLATES = [
  {
    id: "TMPL-01",
    name: "Flash Flood Immediate Evacuation (CAP 1.2)",
    body: "URGENT: Flash flood conditions developing in [Region]. River levels rising rapidly. Evacuate low-lying corridors immediately.",
    category: "Flood"
  },
  {
    id: "TMPL-02",
    name: "Corridor Landslide Road Blockage Advisory",
    body: "TRAFFIC ADVISORY: Active rockfall/landslide on [Road Name] at [Location]. Corridor impassable. Avoid area; diversion in effect.",
    category: "Road / Landslide"
  },
  {
    id: "TMPL-03",
    name: "Precipitation Watch Notice",
    body: "WEATHER WATCH: Severe rainfall (>50mm/hr) detected upstream. Flash runoff expected within 60 minutes.",
    category: "Weather"
  }
];

export default function AdminAlertRulesPage() {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", trigger: "", severity: "critical", recipients: "" });
  const [toastMessage, setToastMessage] = useState(null);
  const [testSent, setTestSent] = useState(false);

  const handleToggleRule = (id) => {
    setRules(prev => prev.map(r => {
      if (r.id === id) {
        const next = !r.active;
        setToastMessage(`Rule ${r.name} is now ${next ? "ENABLED" : "DISABLED"}.`);
        setTimeout(() => setToastMessage(null), 3000);
        return { ...r, active: next };
      }
      return r;
    }));
  };

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newRule.name || !newRule.trigger) return;
    const created = {
      id: `RULE-0${rules.length + 1}`,
      name: newRule.name,
      trigger: newRule.trigger,
      severity: newRule.severity,
      recipients: newRule.recipients || "Command Dispatch",
      active: true
    };
    setRules([...rules, created]);
    setModalOpen(false);
    setNewRule({ name: "", trigger: "", severity: "critical", recipients: "" });
    setToastMessage(`Automation rule ${created.id} configured and armed!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSendTest = () => {
    setTestSent(true);
    setToastMessage("Test simulation alert triggered to operator terminal & webhook.");
    setTimeout(() => {
      setTestSent(false);
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-amber-400/60 hover:text-amber-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/admin" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Admin Engine Room
        </Link>
        <span>/</span>
        <span className="text-slate-200">Alert Rules & Automation Policies</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BellRing className="w-6 h-6 text-amber-400" />
              Automated Alert Rules & Sirens
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              CAP 1.2 Protocol
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Define automated telemetry trigger logic, multi-channel broadcast criteria, and downstream responder routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSendTest}
            className="flex items-center gap-1.5"
          >
            <Play className={`w-3.5 h-3.5 ${testSent ? "text-amber-400" : ""}`} />
            {testSent ? "Transmitting Simulation..." : "Send Test Alert"}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Rule Builder
          </Button>
        </div>
      </div>

      {/* Active Rules List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Active Trigger Policies</h2>
          <span className="text-xs text-slate-500 font-mono">{rules.filter(r => r.active).length} of {rules.length} Armed</span>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div 
              key={rule.id}
              className={`p-4 rounded-xl border transition-all ${
                rule.active 
                  ? "bg-slate-950/70 border-slate-800" 
                  : "bg-slate-950/30 border-slate-900 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{rule.id}</span>
                    <h3 className="text-sm font-semibold text-white">{rule.name}</h3>
                    <Badge variant={rule.severity === "critical" ? "danger" : "warning"} className="text-[10px]">
                      {rule.severity}
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-300 font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800 inline-block">
                    WHEN: {rule.trigger}
                  </div>
                  <div className="text-xs text-slate-400">
                    <strong className="text-slate-500">Recipients:</strong> {rule.recipients}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button 
                    onClick={() => handleToggleRule(rule.id)}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200"
                  >
                    {rule.active ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Armed
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-slate-600" />
                        Disarmed
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Predefined Alert Templates */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h2 className="text-base font-semibold text-white">Predefined Standard Alert Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-400">{tmpl.id}</span>
                <Badge variant="outline" className="text-[10px]">{tmpl.category}</Badge>
              </div>
              <h4 className="text-xs font-semibold text-white">{tmpl.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono bg-slate-900 p-2 rounded border border-slate-800/80">
                &ldquo;{tmpl.body}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* New Rule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">Configure Automation Rule</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Rule Policy Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Teesta Basin Silt Flash Warning"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Trigger Logic Expression</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Soil Moisture > 90% AND 24h Rainfall > 100mm"
                  value={newRule.trigger}
                  onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1">Severity Tier</label>
                  <select 
                    value={newRule.severity}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-500 outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1">Dispatch Channels</label>
                  <input 
                    type="text"
                    placeholder="e.g. Siren Grid, SDRF Radio"
                    value={newRule.recipients}
                    onChange={(e) => setNewRule({ ...newRule, recipients: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Arm Automation Policy</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}