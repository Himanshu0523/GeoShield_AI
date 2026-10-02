"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Plus, 
  Upload, 
  Download, 
  FileCode, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  Layers, 
  Globe, 
  X,
  Sparkles
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

const INITIAL_REGIONS = [
  {
    id: "REG-01",
    name: "Northern Sikkim (Sector 4)",
    code: "SK-NORTH-04",
    population: "42,800",
    areaKm2: "1,240 km²",
    geoJsonStatus: "Valid (3,400 Vertices)",
    lastGeoUpdate: "Sep 22, 2026",
    status: "active",
    sensorsActive: 14
  },
  {
    id: "REG-02",
    name: "Western Ridge (Pass 9)",
    code: "SK-WEST-09",
    population: "18,400",
    areaKm2: "890 km²",
    geoJsonStatus: "Valid (2,180 Vertices)",
    lastGeoUpdate: "Sep 15, 2026",
    status: "active",
    sensorsActive: 9
  },
  {
    id: "REG-03",
    name: "Eastern Valley (Lowlands)",
    code: "SK-EAST-02",
    population: "112,000",
    areaKm2: "2,100 km²",
    geoJsonStatus: "Valid (5,100 Vertices)",
    lastGeoUpdate: "Aug 30, 2026",
    status: "active",
    sensorsActive: 22
  },
  {
    id: "REG-04",
    name: "Upper Catchment Zone",
    code: "SK-UPPER-01",
    population: "6,200",
    areaKm2: "3,400 km²",
    geoJsonStatus: "Valid (8,900 Vertices)",
    lastGeoUpdate: "Aug 10, 2026",
    status: "active",
    sensorsActive: 6
  }
];

export default function AdminRegionsConfigPage() {
  const [regions, setRegions] = useState(INITIAL_REGIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ name: "", code: "", population: "", areaKm2: "", geoJsonData: "" });
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleStatus = (id) => {
    setRegions(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.status === "active" ? "inactive" : "active";
        setToastMessage(`Region ${r.name} telemetry feed marked as ${nextStatus}.`);
        setTimeout(() => setToastMessage(null), 3000);
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  };

  const handleAddRegion = (e) => {
    e.preventDefault();
    if (!modalData.name) return;
    const newReg = {
      id: `REG-0${regions.length + 1}`,
      name: modalData.name,
      code: modalData.code || `REG-NEW-${regions.length + 1}`,
      population: modalData.population || "25,000",
      areaKm2: modalData.areaKm2 || "1,000 km²",
      geoJsonStatus: modalData.geoJsonData ? "Valid GeoJSON Ingested" : "Default Bounds (Bounding Box)",
      lastGeoUpdate: "Today",
      status: "active",
      sensorsActive: 0
    };
    setRegions([...regions, newReg]);
    setModalOpen(false);
    setModalData({ name: "", code: "", population: "", areaKm2: "", geoJsonData: "" });
    setToastMessage(`Monitored sector ${newReg.name} provisioned and bounded!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-lg flex items-center justify-between text-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400/60 hover:text-emerald-300">
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
        <span className="text-slate-200">Monitored Sectors & GIS Configuration</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <MapPin className="w-6 h-6 text-emerald-400" />
              Monitored Spatial Regions & GIS Layers
            </h1>
            <Badge variant="outline" className="text-xs font-mono">
              GeoJSON Polygons
            </Badge>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Configure spatial boundary polygons, catchment basins, critical corridor buffers, and telemetry density.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setToastMessage("Select CSV file to bulk provision regional boundaries.");
              setTimeout(() => setToastMessage(null), 3000);
            }}
            className="flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            Bulk CSV Import
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Monitored Region
          </Button>
        </div>
      </div>

      {/* Region Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Spatial Polygon Roster</h2>
          <span className="text-xs text-slate-500 font-mono">{regions.length} Registered Sectors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Sector Name & Code</th>
                <th className="py-2.5 px-3">Boundary Definition</th>
                <th className="py-2.5 px-3">Population Baseline</th>
                <th className="py-2.5 px-3">Territory Area</th>
                <th className="py-2.5 px-3">Sensors</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {regions.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white">{reg.name}</div>
                    <div className="text-slate-500 font-mono text-[11px]">{reg.code}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{reg.geoJsonStatus}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Updated {reg.lastGeoUpdate}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">{reg.population}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{reg.areaKm2}</td>
                  <td className="py-3 px-3 font-mono text-blue-400">{reg.sensorsActive} Active</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                      reg.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      "bg-slate-800 text-slate-400"
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button 
                      onClick={() => handleToggleStatus(reg.id)}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      {reg.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <Link href={`/regions/${reg.id.toLowerCase()}`} className="text-xs text-blue-400 hover:underline">
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Region Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white">Define New Monitored Sector</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddRegion} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Sector Name</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Southern Teesta Valley"
                  value={modalData.name}
                  onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1">Sector Code</label>
                  <input 
                    type="text"
                    placeholder="e.g. SK-SOUTH-01"
                    value={modalData.code}
                    onChange={(e) => setModalData({ ...modalData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 uppercase mb-1">Census Population</label>
                  <input 
                    type="text"
                    placeholder="e.g. 54,000"
                    value={modalData.population}
                    onChange={(e) => setModalData({ ...modalData, population: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">
                  GeoJSON Boundary Polygon (Paste GeoJSON Feature or FeatureCollection)
                </label>
                <textarea 
                  rows={4}
                  placeholder='{"type": "Polygon", "coordinates": [[[88.5, 27.3], [88.6, 27.3], ...]]}'
                  value={modalData.geoJsonData}
                  onChange={(e) => setModalData({ ...modalData, geoJsonData: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs font-mono focus:border-emerald-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Provision Sector</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}