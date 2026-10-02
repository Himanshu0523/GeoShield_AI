"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Settings, 
  Globe, 
  Key, 
  Palette, 
  Radio, 
  ShieldAlert, 
  Save, 
  CheckCircle2, 
  ArrowLeft, 
  AlertTriangle, 
  Trash2, 
  Download,
  Lock,
  Server,
  X
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AdminGlobalSettingsPage() {
  const [toastMessage, setToastMessage] = useState(null);

  // Form states
  const [general, setGeneral] = useState({
    systemName: "GeoShield AI Command Center",
    timezone: "Asia/Kolkata (IST +05:30)",
    locale: "en-IN",
    refreshInterval: "15"
  });

  const [integrations, setIntegrations] = useState({
    imdApiKey: "••••••••••••••••imd_sec_8921",
    openWeatherKey: "••••••••••••••••owm_live_9011",
    sdrfWebhook: "https://eoc.sikkim.gov.in/api/v1/geoshield/webhook",
    slackAlertsWebhook: "https://hooks.slack.com/services/T00/B00/XXXX"
  });

  const [security, setSecurity] = useState({
    sessionTimeout: "30",
    enforceMfa: true,
    ipAllowlistOnly: true,
    minPasswordLength: "12"
  });

  const handleSaveSection = (sectionName) => {
    setToastMessage(`${sectionName} configurations committed to database.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDangerAction = (actionName) => {
    if (confirm(`CRITICAL CONFIRMATION: Are you sure you wish to execute '${actionName}'? This action is recorded in immutable audit logs.`)) {
      setToastMessage(`${actionName} initiated successfully.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400/60 hover:text-emerald-300">
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
        <span className="text-slate-200">Global System Settings</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-400" />
              Global System Parameters & Integrations
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              Production Environment
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Configure telemetry polling cadence, external Doppler APIs, security policies, and inter-agency endpoints.
          </p>
        </div>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: General & Environment */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400" />
              General & Regional Locale
            </h2>
            <Badge variant="outline" className="text-[10px]">Core</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">Command System Name</label>
              <input 
                type="text"
                value={general.systemName}
                onChange={(e) => setGeneral({ ...general, systemName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Operational Timezone</label>
                <input 
                  type="text"
                  disabled
                  value={general.timezone}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 text-slate-400 rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Auto Polling (Seconds)</label>
                <input 
                  type="number"
                  value={general.refreshInterval}
                  onChange={(e) => setGeneral({ ...general, refreshInterval: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveSection("General Locale")}>
              <Save className="w-3.5 h-3.5 mr-1" /> Save General Settings
            </Button>
          </div>
        </div>

        {/* Section 2: External API Keys & Webhooks */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              Telemetry APIs & External Integrations
            </h2>
            <Badge variant="outline" className="text-[10px]">Active</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">IMD Radar API Token</label>
              <input 
                type="text"
                value={integrations.imdApiKey}
                onChange={(e) => setIntegrations({ ...integrations, imdApiKey: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">SDRF EOC Dispatch Webhook URL</label>
              <input 
                type="text"
                value={integrations.sdrfWebhook}
                onChange={(e) => setIntegrations({ ...integrations, sdrfWebhook: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveSection("Telemetry Integrations")}>
              <Save className="w-3.5 h-3.5 mr-1" /> Save API Integrations
            </Button>
          </div>
        </div>

        {/* Section 3: Security & Session Hardening */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Operator Security & Session Hardening
            </h2>
            <Badge variant="outline" className="text-[10px]">Enforced</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Session Inactivity Timeout (Mins)</label>
                <input 
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Minimum Password Length</label>
                <input 
                  type="number"
                  value={security.minPasswordLength}
                  onChange={(e) => setSecurity({ ...security, minPasswordLength: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={security.enforceMfa}
                  onChange={(e) => setSecurity({ ...security, enforceMfa: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-blue-500"
                />
                <span>Enforce mandatory Two-Factor Authentication (2FA) for all staff</span>
              </label>

              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={security.ipAllowlistOnly}
                  onChange={(e) => setSecurity({ ...security, ipAllowlistOnly: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-blue-500"
                />
                <span>Restrict operational logins to whitelisted government VPN IPs</span>
              </label>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveSection("Security Policies")}>
              <Save className="w-3.5 h-3.5 mr-1" /> Save Security Policies
            </Button>
          </div>
        </div>

        {/* Section 4: Map Tile Providers & Basemaps */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              Basemap Cartography & GIS Tiles
            </h2>
            <Badge variant="outline" className="text-[10px]">MapLibre</Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">Primary Basemap Vector Style</label>
              <select className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500">
                <option>CartoDB Dark Matter (High-Contrast Night Operations)</option>
                <option>OpenStreetMap Topo Contour (Elevation Mode)</option>
                <option>USGS Satellite Imagery Multi-Spectral</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 uppercase mb-1">Elevation Contour Multiplier</label>
              <input 
                type="text"
                defaultValue="1.5x Vertical Exaggeration"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button size="sm" variant="primary" onClick={() => handleSaveSection("Cartography & Basemap")}>
              <Save className="w-3.5 h-3.5 mr-1" /> Save Cartography
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900 border border-red-500/40 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <h2 className="text-base font-bold text-red-400">Danger Zone & Administrative Overrides</h2>
          </div>
          <Badge variant="danger" className="text-[10px]">Restricted</Badge>
        </div>

        <p className="text-xs text-slate-400">
          Destructive actions require root credentials and generate permanent tamper-evident audit records.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div>
            <div className="text-sm font-semibold text-white">Export Full Historical Archive</div>
            <div className="text-xs text-slate-400">Download complete sensor telemetry, incident audits, and GeoJSON boundaries.</div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleDangerAction("Export Full Archive (7.4 GB)")}
            className="flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Complete Database
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
          <div>
            <div className="text-sm font-semibold text-red-400">Purge Telemetry Cache & Soft-Reset State</div>
            <div className="text-xs text-slate-400">Clear ephemeral telemetry caches and force reconnect on all WebSocket listeners.</div>
          </div>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => handleDangerAction("Telemetry Cache Purge")}
            className="flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Purge Cache & Restart Daemons
          </Button>
        </div>
      </div>
    </div>
  );
}