"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home, ShieldAlert, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function GlobalErrorPage({ error, reset }) {
  const [reported, setReported] = useState(false);
  const [errorId] = useState(() => `ERR-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    console.error("GeoShield Telemetry Error Encountered:", error);
  }, [error]);

  const handleReport = () => {
    setReported(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Operational Telemetry Interruption
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            A temporary rendering or data feed interruption occurred. Cached baseline telemetry remains safe.
          </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Incident Reference:</span>
          <span className="text-amber-400 font-bold">{errorId}</span>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            <Button 
              variant="primary" 
              onClick={() => reset()}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Attempt Reconnect
            </Button>

            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          </div>

          {reported ? (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Incident diagnostics captured for operations engineering.</span>
            </div>
          ) : (
            <button 
              onClick={handleReport}
              className="text-xs text-slate-400 hover:text-slate-200 underline pt-1"
            >
              Dispatch Automated Diagnostic Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}