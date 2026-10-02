"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Lock, Mail, User, Building, ShieldCheck, ArrowRight, AlertCircle, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "FIELD_RESPONDER",
    department: "National Disaster Response",
    password: "",
    confirmPassword: "",
    tenantCode: "HQ-MAIN",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const rules = [
    { label: "At least 8 characters", valid: formData.password.length >= 8 },
    { label: "Contains uppercase letter", valid: /[A-Z]/.test(formData.password) },
    { label: "Contains special symbol (!@#$%^&*)", valid: /[!@#$%^&*]/.test(formData.password) },
    { label: "Passwords match", valid: formData.password.length > 0 && formData.password === formData.confirmPassword },
  ];

  const isValidPassword = rules.every((r) => r.valid);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid official agency email address.");
      return;
    }

    if (!isValidPassword) {
      setError("Please satisfy all password security requirements.");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        password: formData.password,
        tenantCode: formData.tenantCode,
      });
    } catch (err) {
      setError(err.message || "Registration failed. An account with this email may already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl space-y-6 relative max-w-lg mx-auto">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span className="text-xl font-extrabold text-white tracking-tight">Operator Onboarding</span>
        </div>
        <p className="text-xs text-slate-400">
          Provision disaster command credentials and activate your telemetry profile.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">Full Name</label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Capt. Rajesh Kumar"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              required
            />
            <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5">Official Work Email</label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="responder@geoshield.gov.in"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              required
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Command Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 transition-all"
            >
              <option value="FIELD_RESPONDER">Field Responder</option>
              <option value="ANALYST">Risk Analyst</option>
              <option value="INCIDENT_COMMANDER">Incident Commander</option>
              <option value="ADMIN">System Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Agency / Dept</label>
            <div className="relative">
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Disaster Response Unit"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
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
          disabled={isLoading || !isValidPassword}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Create Account & Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
        <span>Already registered?</span>
        <Link href="/login" className="text-blue-400 hover:underline">
          Sign In to Command Center
        </Link>
      </div>
    </div>
  );
}
