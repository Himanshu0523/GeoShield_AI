"use client";

import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import { AlertCircle, RefreshCw, BarChart2 } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Custom Dark-Mode Tooltip for GeoShield Command Center
 */
function CommandTooltip({ active, payload, label, unit = "" }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs space-y-1">
        <div className="text-slate-400 font-mono font-medium">{label}</div>
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5" style={{ color: entry.color || entry.stroke || entry.fill }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.stroke || entry.fill }} />
              {entry.name}:
            </span>
            <span className="font-mono font-bold text-white">
              {entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * Robust Telemetry Chart Component
 * Implements full loading skeleton, empty state guard, and error recovery.
 */
export default function TelemetryChart({
  data = [],
  series = [],
  type = "area", // "area" | "line" | "bar"
  xAxisKey = "timestamp",
  height = 260,
  unit = "",
  isLoading = false,
  isError = false,
  errorMessage = "Unable to fetch live telemetry stream.",
  onRetry = null,
  emptyMessage = "No telemetry data recorded for this period."
}) {
  // Safe validation of data array
  const hasValidData = useMemo(() => {
    return Array.isArray(data) && data.length > 0;
  }, [data]);

  // Loading State: Render Skeleton
  if (isLoading) {
    return (
      <div 
        style={{ height }} 
        className="w-full bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col justify-between animate-pulse"
      >
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="space-y-2">
          <div className="h-2 bg-slate-800 rounded w-full" />
          <div className="h-2 bg-slate-800 rounded w-5/6" />
          <div className="h-2 bg-slate-800 rounded w-4/6" />
        </div>
        <div className="flex justify-between items-end gap-2 h-28">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 bg-slate-800/80 rounded-t"
              style={{ height: `${20 + (i % 4) * 20}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Error State: Render Friendly Error with Retry
  if (isError) {
    return (
      <div 
        style={{ height }} 
        className="w-full bg-slate-950/60 rounded-xl border border-red-500/20 p-6 flex flex-col items-center justify-center text-center space-y-3"
      >
        <AlertCircle className="w-8 h-8 text-red-400" />
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">Telemetry Sync Failure</h4>
          <p className="text-xs text-slate-400 max-w-xs">{errorMessage}</p>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="text-xs flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
          </Button>
        )}
      </div>
    );
  }

  // Empty State: Guard against rendering empty ResponsiveContainer
  if (!hasValidData) {
    return (
      <div 
        style={{ height }} 
        className="w-full bg-slate-950/40 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center space-y-2"
      >
        <BarChart2 className="w-8 h-8 text-slate-600" />
        <p className="text-xs text-slate-400 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div style={{ height, width: "100%" }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        {type === "area" ? (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              {series.map((s, idx) => (
                <linearGradient key={idx} id={`color-${s.dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color || "#3b82f6"} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={s.color || "#3b82f6"} stopOpacity={0.0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <Tooltip content={<CommandTooltip unit={unit} />} />
            {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />}
            {series.map((s, idx) => (
              <Area
                key={idx}
                type="monotone"
                dataKey={s.dataKey}
                name={s.label || s.dataKey}
                stroke={s.color || "#3b82f6"}
                strokeWidth={2}
                fillOpacity={1}
                fill={`url(#color-${s.dataKey})`}
              />
            ))}
          </AreaChart>
        ) : type === "line" ? (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <Tooltip content={<CommandTooltip unit={unit} />} />
            {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />}
            {series.map((s, idx) => (
              <Line
                key={idx}
                type="monotone"
                dataKey={s.dataKey}
                name={s.label || s.dataKey}
                stroke={s.color || "#3b82f6"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey={xAxisKey} stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickLine={false} />
            <Tooltip content={<CommandTooltip unit={unit} />} />
            {series.length > 1 && <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />}
            {series.map((s, idx) => (
              <Bar
                key={idx}
                dataKey={s.dataKey}
                name={s.label || s.dataKey}
                fill={s.color || "#3b82f6"}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
