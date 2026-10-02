"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Lock, Mail, ShieldAlert, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("alok.verma@geoshield.gov.in");
  const [password, setPassword] = useState("Operator@123");
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid emergency credentials. Check official email and password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 relative">
      <div className="space-y-2">
        <div className="flex items-center gap-2 lg:hidden mb-4">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-bold text-white">GeoShield AI</span>
        </div>
        <h1 className="text-xl font-extrabold text-white tracking-tight">Operator Sign In</h1>
        <p className="text-xs text-slate-400">
          Enter your emergency command credentials to access live telemetry.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">Work Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@geoshield.gov"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              required
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-slate-300 font-semibold">Password</label>
            <Link href="/forgot-password" className="text-[11px] text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              required
            />
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-slate-400 text-[11px]">Remember this device</span>
          </label>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
        <span>Need credentials?</span>
        <Link href="/register" className="text-blue-400 hover:underline">
          Request Operator Access
        </Link>
      </div>
    </div>
  );
}