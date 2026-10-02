"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function UnauthorizedBoundaryPage() {
  const [requested, setRequested] = useState(false);

  const handleRequestAccess = () => {
    setRequested(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white tracking-tight">
            Restricted Operational Boundary
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            You don’t have access to this page. This terminal view requires an elevated <span className="text-blue-400 font-medium">Administrator</span> or <span className="text-blue-400 font-medium">Incident Commander</span> role.
          </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
          Required clearance: RBAC Level 4 (System Config)
        </div>

        <div className="space-y-3 pt-2">
          {requested ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Access request transmitted to Central Admin for review.</span>
            </div>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleRequestAccess}
              className="w-full flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Request Role Access from Administrator
            </Button>
          )}

          <Link href="/" className="block">
            <Button variant="ghost" className="w-full text-slate-400 hover:text-white flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Operational Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}