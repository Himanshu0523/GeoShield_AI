"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Users, 
  MapPin, 
  BellRing, 
  Settings, 
  Server, 
  Database, 
  Wifi, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  RefreshCw,
  HardDrive,
  Cpu
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const ADMIN_LINKS = [
  {
    title: "User & Access Management",
    description: "Manage operator accounts, RBAC permissions, and biometric/MFA credentials.",
    href: "/admin/users",
    icon: Users,
    count: "24 Active Personnel",
    color: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400"
  },
  {
    title: "Monitored Regions & GIS",
    description: "Configure spatial boundaries, GeoJSON overlays, critical infrastructure nodes, and population baselines.",
    href: "/admin/regions",
    icon: MapPin,
    count: "4 Active Sectors",
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400"
  },
  {
    title: "Alert Rules & Automation",
    description: "Configure automated threshold triggers, dispatch routing rules, and CAP 1.2 sirens.",
    href: "/admin/alerts",
    icon: BellRing,
    count: "12 Trigger Policies",
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400"
  },
  {
    title: "Global System Settings",
    description: "API keys, external telemetry integrations, map tile providers, and security hardening.",
    href: "/admin/settings",
    icon: Settings,
    count: "5 Connected Services",
    color: "from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400"
  }
];

const AUDIT_LOG = [
  { id: "AUD-991", action: "User Role Escalation", actor: "admin@geoshield.gov.in", target: "s.rawat (Field Patrol -> Lead Inspector)", time: "18m ago" },
  { id: "AUD-990", action: "Alert Threshold Modified", actor: "duty.analyst@geoshield.gov.in", target: "Teesta Gauge Warning from 1.5m to 1.8m", time: "1h 40m ago" },
  { id: "AUD-989", action: "GeoJSON Boundary Updated", actor: "admin@geoshield.gov.in", target: "Western Ridge Pass 9 Perimeter Revision", time: "3h 12m ago" },
  { id: "AUD-988", action: "API Key Rotated", actor: "system.daemon", target: "IMD Doppler Radar Endpoint Credentials", time: "12h ago" },
];

export default function AdminEngineRoomPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-500" />
              Admin Command & Engine Room
            </h1>
            <Badge variant="outline" className="text-xs">
              Root Level Access
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            System health telemetry, node orchestrations, access boundaries, and operational audit trail.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-blue-400" : ""}`} />
            Diagnostic Health Check
          </Button>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Registered Operators</span>
          <div className="text-2xl font-bold text-white mt-1">24 Active</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 3 regional control rooms</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Live Sessions</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">8 Connected</div>
          <div className="text-[11px] text-emerald-500/80 mt-1">Zero unauthorized IP attempts</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Monitored Sectors</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">4 Sectors</div>
          <div className="text-[11px] text-slate-500 mt-1">100% boundary coverage active</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Alerts Generated (24h)</span>
          <div className="text-2xl font-bold text-amber-400 mt-1">5 Dispatched</div>
          <div className="text-[11px] text-slate-500 mt-1">100% downstream receipt delivery</div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ADMIN_LINKS.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.href}
              href={item.href}
              className={`p-5 rounded-xl border bg-gradient-to-br ${item.color} bg-slate-900/60 hover:bg-slate-900 hover:border-slate-600 transition-all group`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-white transition-colors">
                  <span>Manage</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-slate-400">{item.count}</span>
                <span className="text-[11px] text-slate-500 font-mono">Configured</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* System Engine Health & Daemon Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-400" />
              Core Telemetry & Daemon Health
            </h2>
            <Badge variant="success" className="text-[10px]">
              All Feeds Operational
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-white font-medium">FastAPI Ingest Gateway</div>
                  <div className="text-slate-500 text-[11px]">Port 8000 • Latency 14ms • 99.98% Uptime</div>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">HTTP 200 OK</Badge>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-white font-medium">WebSocket Telemetry Multiplexer</div>
                  <div className="text-slate-500 text-[11px]">Port 8080 • Active Socket Pool: 24 Connections</div>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">Connected</Badge>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-white font-medium">PostGIS Spatial Database Cluster</div>
                  <div className="text-slate-500 text-[11px]">Primary Master + Hot Standby • 14.8 GB Storage</div>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">Healthy</Badge>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <div className="text-white font-medium">IMD Doppler Radar Telemetry Bridge</div>
                  <div className="text-slate-500 text-[11px]">Satellite Sync: 2m cycle • Last packet 12:44:02 IST</div>
                </div>
              </div>
              <Badge variant="success" className="text-[10px]">Synced</Badge>
            </div>
          </div>
        </div>

        {/* Recent Admin Audit Trail */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              Administrative Audit Log
            </h2>
            <span className="text-xs text-slate-500 font-mono">Live</span>
          </div>

          <div className="space-y-3">
            {AUDIT_LOG.map((log) => (
              <div key={log.id} className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{log.action}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                </div>
                <div className="text-slate-400 text-[11px] truncate">{log.target}</div>
                <div className="text-[10px] text-slate-500 font-mono">By: {log.actor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}