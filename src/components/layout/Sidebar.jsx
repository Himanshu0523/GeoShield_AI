"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Map, AlertTriangle, Route, TrendingUp,
  ShieldAlert, ListOrdered, Bell, FileText, BarChart3,
  Users, Settings, Shield
} from "lucide-react";

const navItems = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/map", label: "Map", icon: Map },
  { href: "/regions", label: "Regions", icon: Shield },
  { href: "/roads", label: "Roads", icon: Route },
  { href: "/forecast", label: "Forecast", icon: TrendingUp },
  { href: "/risk", label: "Risk", icon: ShieldAlert },
  { href: "/priority", label: "Priority", icon: ListOrdered },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/field-reports", label: "Field Reports", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 h-screen flex flex-col">
      <div className="p-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-bold text-white">GeoShield AI</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}