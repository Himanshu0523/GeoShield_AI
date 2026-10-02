"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  Waves, 
  Mountain, 
  Radio, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink, 
  UserCheck, 
  CheckCheck, 
  Send, 
  Plus, 
  Filter, 
  RefreshCw, 
  X,
  Volume2
} from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const INITIAL_ALERTS = [
  {
    id: "ALT-8902",
    title: "Critical Flash Flood Warning: Teesta River Basin",
    description: "Water levels exceeded warning threshold by 1.8m at Chungthang gauging station. Inundation of lower NH-10 sectors imminent within 45 minutes.",
    severity: "critical",
    category: "flood",
    region: "Northern Sikkim (Sector 4)",
    timestamp: "3m ago",
    rawTime: "12:35:10 IST",
    status: "active",
    assignedTo: null,
    source: "IMD Doppler & River Telemetry"
  },
  {
    id: "ALT-8899",
    title: "Active Debris Flow / Landslide on Western Ridge Pass",
    description: "Slopemeter sensor SL-09 detected 42mm displacement in 10 mins. Mudflow traversing carriage way on Sector 3.",
    severity: "critical",
    category: "landslide",
    region: "Western Ridge (Pass 9)",
    timestamp: "14m ago",
    rawTime: "12:24:00 IST",
    status: "active",
    assignedTo: "Inspector S. Rawat",
    source: "Geotechnical Slopemeter Grid"
  },
  {
    id: "ALT-8894",
    title: "Culvert Silt Blockage & Water Logging Hazard",
    description: "Field report FR-104 confirmed 80% culvert capacity blockage. Secondary drainage overflowing toward residential bypass.",
    severity: "warning",
    category: "infrastructure",
    region: "Eastern Valley (Lowlands)",
    timestamp: "38m ago",
    rawTime: "12:00:22 IST",
    status: "acknowledged",
    assignedTo: "Eng. M. Joshi",
    source: "Mobile Field Patrol"
  },
  {
    id: "ALT-8887",
    title: "Heavy Precipitation Cloudburst Pre-Warning",
    description: "Radar reflectivity >52 dBZ moving South-East. Precipitation accumulation estimated >65mm/hr.",
    severity: "warning",
    category: "weather",
    region: "Upper Catchment Zone",
    timestamp: "1h 10m ago",
    rawTime: "11:28:15 IST",
    status: "acknowledged",
    assignedTo: "Duty Met Analyst",
    source: "Satellite Hydro-Estimator"
  },
  {
    id: "ALT-8871",
    title: "Minor Rockfall Cleared: NH-10A Sector 2",
    description: "Emergency road crew cleared 4 cubic meters of shale debris. Corridor open with speed restriction (20 km/h).",
    severity: "info",
    category: "road",
    region: "Central Corridor",
    timestamp: "2h 45m ago",
    rawTime: "09:53:11 IST",
    status: "resolved",
    assignedTo: "SDRF Unit 4",
    source: "Corridor Highway Patrol"
  }
];

export default function AlertsLiveFeedPage() {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [filterTab, setFilterTab] = useState("all");
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    title: "",
    region: "Northern Sikkim (Sector 4)",
    severity: "critical",
    category: "flood",
    description: ""
  });
  const [bannerNotice, setBannerNotice] = useState(null);

  const filterAlerts = () => {
    if (filterTab === "critical") return alerts.filter(a => a.severity === "critical");
    if (filterTab === "active") return alerts.filter(a => a.status === "active");
    if (filterTab === "acknowledged") return alerts.filter(a => a.status === "acknowledged");
    if (filterTab === "resolved") return alerts.filter(a => a.status === "resolved");
    return alerts;
  };

  const filtered = filterAlerts();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAlerts(filtered.map(a => a.id));
    } else {
      setSelectedAlerts([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedAlerts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleAcknowledge = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "acknowledged", assignedTo: a.assignedTo || "Current Operator" } : a));
    setBannerNotice(`Alert ${id} marked as Acknowledged.`);
    setTimeout(() => setBannerNotice(null), 3000);
  };

  const handleResolve = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" } : a));
    setBannerNotice(`Alert ${id} marked as Resolved.`);
    setTimeout(() => setBannerNotice(null), 3000);
  };

  const handleBulkAcknowledge = () => {
    setAlerts(prev => prev.map(a => selectedAlerts.includes(a.id) ? { ...a, status: "acknowledged", assignedTo: a.assignedTo || "Current Operator" } : a));
    setBannerNotice(`${selectedAlerts.length} alerts acknowledged simultaneously.`);
    setSelectedAlerts([]);
    setTimeout(() => setBannerNotice(null), 3500);
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastData.title || !broadcastData.description) return;
    const newAlert = {
      id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: broadcastData.title,
      description: broadcastData.description,
      severity: broadcastData.severity,
      category: broadcastData.category,
      region: broadcastData.region,
      timestamp: "Just now",
      rawTime: new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
      status: "active",
      assignedTo: "Broadcast Control",
      source: "Command Center Broadcast"
    };
    setAlerts([newAlert, ...alerts]);
    setBroadcastModalOpen(false);
    setBroadcastData({ title: "", region: "Northern Sikkim (Sector 4)", severity: "critical", category: "flood", description: "" });
    setBannerNotice(`Priority broadcast ${newAlert.id} dispatched across all operational terminals!`);
    setTimeout(() => setBannerNotice(null), 4000);
  };

  const counts = {
    all: alerts.length,
    critical: alerts.filter(a => a.severity === "critical").length,
    active: alerts.filter(a => a.status === "active").length,
    acknowledged: alerts.filter(a => a.status === "acknowledged").length,
    resolved: alerts.filter(a => a.status === "resolved").length,
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner Notice */}
      {bannerNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{bannerNotice}</span>
          </div>
          <button onClick={() => setBannerNotice(null)} className="text-emerald-400/60 hover:text-emerald-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              Live Alert Wire
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 border border-red-500/30 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              LIVE TELEMETRY FEED
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {alerts.length} Records
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time multi-hazard telemetry, sensor threshold violations, and inter-agency warnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            size="sm" 
            onClick={() => setBannerNotice("Checking latest telemetry endpoints...")}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Feeds
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => setBroadcastModalOpen(true)}
            className="flex items-center gap-2 shadow-lg shadow-red-950/40"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            Broadcast New Alert
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Alert Feed Stream */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filter Bar & Bulk Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "all", label: "All Alerts", count: counts.all },
                { id: "critical", label: "Critical", count: counts.critical },
                { id: "active", label: "Active", count: counts.active },
                { id: "acknowledged", label: "Acknowledged", count: counts.acknowledged },
                { id: "resolved", label: "Resolved", count: counts.resolved },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    filterTab === tab.id
                      ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  {tab.label}
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    filterTab === tab.id ? "bg-slate-700 text-slate-200" : "bg-slate-800 text-slate-500"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {selectedAlerts.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{selectedAlerts.length} selected</span>
                <Button size="sm" variant="secondary" onClick={handleBulkAcknowledge} className="text-xs">
                  <CheckCheck className="w-3.5 h-3.5 mr-1" />
                  Acknowledge Selected
                </Button>
              </div>
            )}
          </div>

          {/* Alert Feed Items */}
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto opacity-80" />
              <h3 className="text-lg font-medium text-white">All Clear in this Category</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                No active sensor threshold violations or broadcast alerts match the selected filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedAlerts.length === filtered.length && filtered.length > 0} 
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                  />
                  <span>Select all in view</span>
                </label>
                <span>Ordered chronologically (Newest first)</span>
              </div>

              {filtered.map((alert) => {
                const isCritical = alert.severity === "critical";
                const isWarning = alert.severity === "warning";
                const isSelected = selectedAlerts.includes(alert.id);

                return (
                  <div 
                    key={alert.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/5"
                        : isCritical
                        ? "bg-slate-900/80 border-red-500/40 hover:border-red-500/70"
                        : isWarning
                        ? "bg-slate-900/80 border-amber-500/30 hover:border-amber-500/60"
                        : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(alert.id)}
                        className="mt-1 rounded border-slate-700 bg-slate-900 text-blue-500 focus:ring-0"
                      />

                      <div className="flex-1 space-y-2">
                        {/* Title & Metadata Top Line */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge 
                              variant={
                                isCritical ? "danger" : isWarning ? "warning" : "default"
                              }
                              className="uppercase tracking-wider text-[10px] font-bold"
                            >
                              {isCritical && <Flame className="w-3 h-3 mr-1 inline" />}
                              {isWarning && <AlertTriangle className="w-3 h-3 mr-1 inline" />}
                              {alert.severity}
                            </Badge>
                            
                            <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                              {alert.id}
                            </span>

                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {alert.region}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span title={alert.rawTime}>{alert.timestamp}</span>
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                              alert.status === "active" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                              alert.status === "acknowledged" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                              "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {alert.status}
                            </span>
                          </div>
                        </div>

                        {/* Title & Narrative */}
                        <div>
                          <h3 className="text-base font-semibold text-white tracking-tight">
                            {alert.title}
                          </h3>
                          <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                            {alert.description}
                          </p>
                        </div>

                        {/* Source telemetry & action strip */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/60 mt-3">
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span className="text-slate-500">Source:</span>
                            <span className="font-mono text-slate-300 bg-slate-800/40 px-1.5 py-0.5 rounded">
                              {alert.source}
                            </span>
                            {alert.assignedTo && (
                              <span className="text-blue-400 flex items-center gap-1 ml-2">
                                <UserCheck className="w-3 h-3" />
                                {alert.assignedTo}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {alert.status === "active" && (
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={() => handleAcknowledge(alert.id)}
                                className="text-xs h-7 px-2.5"
                              >
                                <CheckCheck className="w-3.5 h-3.5 mr-1" />
                                Acknowledge
                              </Button>
                            )}

                            {alert.status !== "resolved" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleResolve(alert.id)}
                                className="text-xs h-7 px-2.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Resolve
                              </Button>
                            )}

                            <Link href="/map">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-xs h-7 px-2 text-slate-300 hover:text-white"
                              >
                                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                View on Map
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Rail: Alert Stats & Dispatch Protocols */}
        <div className="space-y-5">
          {/* Last 24h Severity Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>24h Alert Telemetry</span>
              <Volume2 className="w-4 h-4 text-slate-400" />
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 text-red-400 font-medium">
                    <Flame className="w-3.5 h-3.5" /> Critical / Severe
                  </span>
                  <span className="font-mono font-bold text-white">{counts.critical} active</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> Warning / Watch
                  </span>
                  <span className="font-mono font-bold text-white">2 active</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5" /> Advisory / Resolved
                  </span>
                  <span className="font-mono font-bold text-white">{counts.resolved} cleared</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: "20%" }} />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Auto-dispatch relay</span>
              <span className="text-emerald-400 font-mono">CAP Protocol 1.2 OK</span>
            </div>
          </div>

          {/* Active Broadcast Channels */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Downstream Broadcast Relay</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alerts published to GeoShield automatically synchronize to regional disaster command units and mobile responder networks.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">SDRF Field Radios</span>
                <Badge variant="success" className="text-[10px]">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">NHAI Traffic Advisory SMS</span>
                <Badge variant="success" className="text-[10px]">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="text-slate-300">District Collector EOC</span>
                <Badge variant="success" className="text-[10px]">Online</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                <h2 className="text-lg font-bold text-white">Issue Emergency Broadcast</h2>
              </div>
              <button 
                onClick={() => setBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Alert Title
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Flash Flood Evacuation Notice: Zone 2"
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Severity Tier
                  </label>
                  <select 
                    value={broadcastData.severity}
                    onChange={(e) => setBroadcastData({ ...broadcastData, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none"
                  >
                    <option value="critical">Critical (Life Safety)</option>
                    <option value="warning">Warning (High Risk)</option>
                    <option value="info">Advisory / Info</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Target Region
                  </label>
                  <select 
                    value={broadcastData.region}
                    onChange={(e) => setBroadcastData({ ...broadcastData, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none"
                  >
                    <option value="Northern Sikkim (Sector 4)">Northern Sikkim (Sector 4)</option>
                    <option value="Western Ridge (Pass 9)">Western Ridge (Pass 9)</option>
                    <option value="Eastern Valley (Lowlands)">Eastern Valley (Lowlands)</option>
                    <option value="Upper Catchment Zone">Upper Catchment Zone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Operational Directive / Description
                </label>
                <textarea 
                  rows={4}
                  required
                  placeholder="State the primary hazard, anticipated timeframe, affected routes, and mandatory emergency actions..."
                  value={broadcastData.description}
                  onChange={(e) => setBroadcastData({ ...broadcastData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:border-red-500 outline-none"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-xs text-red-300">
                ⚠️ This alert will immediately trigger telemetry feeds, field responders, and public advisory sirens.
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setBroadcastModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="danger"
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Transmit Broadcast
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}