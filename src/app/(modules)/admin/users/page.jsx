"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  MoreVertical, 
  Lock, 
  KeyRound, 
  Trash2, 
  UserX, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  Mail,
  Shield,
  HelpCircle,
  X
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const INITIAL_USERS = [
  {
    id: "USR-01",
    name: "Dr. Alok Verma",
    email: "alok.verma@geoshield.gov.in",
    role: "Admin",
    status: "active",
    lastLogin: "10m ago",
    department: "National Disaster Management Authority",
    mfaEnabled: true
  },
  {
    id: "USR-02",
    name: "Inspector Suresh Rawat",
    email: "s.rawat@sikkim.police.gov.in",
    role: "Field Responder",
    status: "active",
    lastLogin: "2h ago",
    department: "State Disaster Response Force (SDRF)",
    mfaEnabled: true
  },
  {
    id: "USR-03",
    name: "Meenakshi Joshi",
    email: "m.joshi@nhai.gov.in",
    role: "Corridor Engineer",
    status: "active",
    lastLogin: "Yesterday",
    department: "National Highways Authority of India",
    mfaEnabled: false
  },
  {
    id: "USR-04",
    name: "Tenzing Norbu",
    email: "t.norbu@hydro.met.gov.in",
    role: "Analyst",
    status: "invited",
    lastLogin: "Never",
    department: "Central Water Commission",
    mfaEnabled: false
  },
  {
    id: "USR-05",
    name: "Karan Johar (External)",
    email: "karan.contractor@infra.in",
    role: "Read Only",
    status: "suspended",
    lastLogin: "14 days ago",
    department: "Highway Repair Contractor",
    mfaEnabled: false
  }
];

export default function AdminUsersManagementPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", role: "Analyst", department: "", message: "" });
  const [toastMessage, setToastMessage] = useState(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === "active" ? "suspended" : "active";
        setToastMessage(`User ${u.name} is now ${nextStatus}.`);
        setTimeout(() => setToastMessage(null), 3000);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleResetPassword = (email) => {
    setToastMessage(`Security password reset link dispatched to ${email}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email) return;
    const newUser = {
      id: `USR-${Math.floor(10 + Math.random() * 90)}`,
      name: inviteData.name,
      email: inviteData.email,
      role: inviteData.role,
      status: "invited",
      lastLogin: "Never",
      department: inviteData.department || "Regional Operations",
      mfaEnabled: false
    };
    setUsers([...users, newUser]);
    setInviteModalOpen(false);
    setInviteData({ name: "", email: "", role: "Analyst", department: "", message: "" });
    setToastMessage(`Invitation successfully dispatched to ${newUser.email}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-blue-400/60 hover:text-blue-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/admin" className="hover:text-white flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Admin Engine Room
        </Link>
        <span>/</span>
        <span className="text-slate-200">Personnel & Access Management</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              User & Access Control
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              RBAC Directory
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Manage authorized operators, duty roles, multi-factor enforcement, and command station access policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setInviteModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Invite Operator
          </Button>
        </div>
      </div>

      {/* Role Legend Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-400" /> Admin
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Full system control, rule definitions, user provisioning</div>
        </div>

        <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" /> Field Responder
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Submit ground reports, claim field tasks, live GPS tracking</div>
        </div>

        <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" /> Analyst
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Model parameter calibration, forecast simulations, export reports</div>
        </div>

        <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" /> Read Only
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">View-only telemetry access for external agency liaison</div>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Field Responder">Field Responder</option>
              <option value="Corridor Engineer">Corridor Engineer</option>
              <option value="Analyst">Analyst</option>
              <option value="Read Only">Read Only</option>
            </select>

            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 outline-none focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Personnel Name & Email</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Agency / Department</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Login</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white flex items-center gap-2">
                      {user.name}
                      {user.mfaEnabled && (
                        <span title="2FA / Biometrics Enforced" className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">2FA</span>
                      )}
                    </div>
                    <div className="text-slate-400 text-[11px] font-mono">{user.email}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-200">{user.role}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                    {user.department}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                      user.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      user.status === "invited" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                      "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{user.lastLogin}</td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button 
                      onClick={() => handleResetPassword(user.email)}
                      title="Send Password Reset"
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                    </button>

                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      title={user.status === "active" ? "Suspend Account" : "Reactivate Account"}
                      className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${
                        user.status === "active" ? "text-slate-400 hover:text-red-400" : "text-emerald-400 hover:text-emerald-300"
                      }`}
                    >
                      {user.status === "active" ? <UserX className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Invite Operational Personnel</h2>
              </div>
              <button onClick={() => setInviteModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Inspector R. K. Thapa"
                  value={inviteData.name}
                  onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Official Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="e.g. officer@agency.gov.in"
                  value={inviteData.email}
                  onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1">Assigned Role</label>
                  <select 
                    value={inviteData.role}
                    onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Field Responder">Field Responder</option>
                    <option value="Corridor Engineer">Corridor Engineer</option>
                    <option value="Analyst">Analyst</option>
                    <option value="Read Only">Read Only</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1">Department / Agency</label>
                  <input 
                    type="text"
                    placeholder="e.g. SDRF Sikkim"
                    value={inviteData.department}
                    onChange={(e) => setInviteData({ ...inviteData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setInviteModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Send Secure Invitation</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}