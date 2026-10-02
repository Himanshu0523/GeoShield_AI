"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Lock, Check, X, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { authService } from "@/services/authService";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const initialToken = searchParams.get("token") || "";

  const [email, setEmail] = useState(initialEmail);
  const [token, setToken] = useState(initialToken);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const rules = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Contains special symbol (!@#$%^&*)", valid: /[!@#$%^&*]/.test(password) },
    { label: "Passwords match", valid: password.length > 0 && password === confirm },
  ];

  const isValid = rules.every((r) => r.valid);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setError("");
    setIsLoading(true);

    try {
      await authService.resetPassword({
        email,
        token,
        newPassword: password,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1800);
    } catch (err) {
      setError(err.message || "Failed to update password. Reset token may have expired.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 relative max-w-md mx-auto">
      <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to login</span>
      </Link>

      <div className="space-y-2">
        <h1 className="text-xl font-extrabold text-white tracking-tight">Set New Password</h1>
        <p className="text-xs text-slate-400">
          Update your disaster command operator security credentials.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2 text-xs text-emerald-400 text-center">
          <CheckCircle2 className="w-8 h-8 mx-auto animate-bounce" />
          <p className="font-bold">Password Updated Successfully</p>
          <p className="text-slate-300">Redirecting to operator sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@geoshield.gov.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Reset Authorization Token</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="e.g. RST-XXXXXX"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">New Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* Password Strength Checklist */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-[11px]">
            <p className="font-semibold text-slate-400">Security Requirements:</p>
            {rules.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {r.valid ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
                <span className={r.valid ? "text-emerald-400" : "text-slate-500"}>{r.label}</span>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={!isValid || isLoading}
            variant="primary"
            className="w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Update Password & Enter</span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-center text-xs">Loading reset authorization...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}