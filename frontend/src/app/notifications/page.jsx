"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bell, 
  CheckCheck, 
  Settings, 
  Clock, 
  ShieldAlert, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2,
  Filter,
  ArrowRight
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const NOTIFICATIONS_GROUPED = [
  {
    day: "Today (Oct 01, 2026)",
    items: [
      {
        id: "NOT-101",
        title: "Assigned to Review: Field Report FR-104",
        detail: "Inspector Suresh Rawat submitted a verified culvert blockage observation in Eastern Valley.",
        severity: "warning",
        time: "12:05 IST",
        read: false,
        link: "/field-reports"
      },
      {
        id: "NOT-102",
        title: "Threshold Warning: Teesta River Basin Gauge",
        detail: "Sensor G-04 crossed 1.8m datum threshold. Auto-dispatch protocol initiated.",
        severity: "critical",
        time: "11:42 IST",
        read: false,
        link: "/alerts"
      },
      {
        id: "NOT-103",
        title: "Scheduled Calibration Complete",
        detail: "Slopemeter sensor grid telemetry health check verified with 0 dropped packets.",
        severity: "info",
        time: "09:00 IST",
        read: true,
        link: "/admin/settings"
      }
    ]
  },
  {
    day: "Yesterday (Sep 30, 2026)",
    items: [
      {
        id: "NOT-098",
        title: "Weekly Risk Anomaly Model Published",
        detail: "Model v2.4 identified 2 spatial clusters along the NH-10 corridor.",
        severity: "info",
        time: "18:30 IST",
        read: true,
        link: "/analytics/risk"
      },
      {
        id: "NOT-097",
        title: "User Account Provisioned",
        detail: "Tenzing Norbu was granted Analyst role access by Central Admin.",
        severity: "info",
        time: "14:15 IST",
        read: true,
        link: "/admin/users"
      }
    ]
  }
];

export default function NotificationsCenterPage() {
  const [groups, setGroups] = useState(NOTIFICATIONS_GROUPED);
  const [filterSeverity, setFilterSeverity] = useState("all");

  const handleMarkAllRead = () => {
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.map(i => ({ ...i, read: true }))
    })));
  };

  const handleMarkOneRead = (id) => {
    setGroups(prev => prev.map(g => ({
      ...g,
      items: g.items.map(i => i.id === id ? { ...i, read: true } : i)
    })));
  };

  const unreadCount = groups.reduce((acc, g) => acc + g.items.filter(i => !i.read).length, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-blue-400" />
              Notifications & Activity Record
            </h1>
            {unreadCount > 0 && (
              <Badge variant="danger" className="text-xs">
                {unreadCount} Unread
              </Badge>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Personal operational log, assignments, rule triggers, and duty dispatch communications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark All as Read
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
              <Settings className="w-3.5 h-3.5" />
              Preferences
            </Button>
          </Link>
        </div>
      </div>

      {/* Notifications Grouped by Day */}
      <div className="space-y-6">
        {groups.map((group, gIdx) => {
          const filteredItems = group.items.filter(item => {
            if (filterSeverity === "all") return true;
            return item.severity === filterSeverity;
          });

          if (filteredItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {group.day}
              </h2>

              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      !item.read 
                        ? "bg-slate-900 border-blue-500/40 shadow-sm shadow-blue-500/5" 
                        : "bg-slate-900/50 border-slate-800/80"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {item.severity === "critical" ? (
                          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                            <Flame className="w-4 h-4" />
                          </div>
                        ) : item.severity === "warning" ? (
                          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`text-sm font-medium ${!item.read ? "text-white font-semibold" : "text-slate-300"}`}>
                            {item.title}
                          </h3>
                          {!item.read && (
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                          {item.detail}
                        </p>
                        <span className="text-[11px] text-slate-500 font-mono block">
                          {item.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {!item.read && (
                        <button 
                          onClick={() => handleMarkOneRead(item.id)}
                          className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800"
                        >
                          Mark read
                        </button>
                      )}
                      <Link href={item.link}>
                        <Button size="sm" variant="ghost" className="text-xs h-7 px-2 text-blue-400 hover:text-blue-300">
                          View <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}