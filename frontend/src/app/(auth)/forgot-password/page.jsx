"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, KeyRound, ArrowRight } from "lucide-react";
import { authService } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid work email address.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await authService.forgotPassword(email);
      setSent(true);
      setResetToken(res?.resetToken || "");
      setCooldown(30);
    } catch (err) {
      setError(err.message || "Failed to process password reset request. Please check email.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError("");
    try {
      const res = await authService.forgotPassword(email);
      setResetToken(res?.resetToken || "");
      setCooldown(30);
    } catch (err) {
      setError(err.message || "Failed to resend reset link.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 relative max-w-md mx-auto">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to login</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-xl font-extrabold text-white tracking-tight">Reset Your Access</h1>
        <p className="text-xs text-slate-400">
          Enter your registered work email and we&apos;ll send a secure reset authorization token.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {sent ? (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Reset Token Dispatched</span>
            </div>
            <p className="text-slate-300">
              We generated a secure reset authorization code for <strong className="text-white">{email}</strong>. Token expires in 15 minutes.
            </p>
            {resetToken && (
              <div className="mt-3 p-2.5 bg-slate-950 rounded border border-emerald-500/20 font-mono text-xs text-emerald-300 flex items-center justify-between">
                <span>Code: <strong className="text-white">{resetToken}</strong></span>
                <span className="text-[10px] text-slate-400">Dev Active</span>
              </div>
            )}
          </div>

          <Link
            href={`/reset-password?email=${encodeURIComponent(email)}${resetToken ? `&token=${encodeURIComponent(resetToken)}` : ""}`}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-colors"
          >
            <KeyRound className="w-4 h-4" />
            <span>Proceed to Set New Password</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-slate-400">Didn&apos;t receive the code?</span>
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className="text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline font-semibold"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Token"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Work Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@geoshield.gov.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} variant="primary" className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Send Reset Authorization</span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}