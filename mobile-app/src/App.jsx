import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Send, 
  ShieldAlert, 
  Radio, 
  CheckCircle, 
  Wifi, 
  WifiOff, 
  PhoneCall, 
  Bell,
  Home,
  RefreshCw,
  User,
  Shield,
  Clock,
  Layers,
  Award,
  Check
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [location, setLocation] = useState({ lat: 27.7172, lng: 85.3240 });
  const [isLocating, setIsLocating] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Sync state
  const [offlineQueue, setOfflineQueue] = useState([
    { id: 'Q-101', type: 'LANDSLIDE', time: '10 mins ago', status: 'Pending Sync' },
    { id: 'Q-102', type: 'ROAD_BLOCK', time: '25 mins ago', status: 'Pending Sync' }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  const [formData, setFormData] = useState({
    regionId: 'KM-NORTH',
    hazardType: 'LANDSLIDE',
    severity: 'HIGH',
    description: '',
    photoAttached: false
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getGPS = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: Number(pos.coords.latitude.toFixed(4)),
            lng: Number(pos.coords.longitude.toFixed(4))
          });
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!isOnline) {
      setOfflineQueue([
        { id: `Q-${Date.now().toString().slice(-3)}`, type: formData.hazardType, time: 'Just now', status: 'Pending Sync' },
        ...offlineQueue
      ]);
    }
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        regionId: 'KM-NORTH',
        hazardType: 'LANDSLIDE',
        severity: 'HIGH',
        description: '',
        photoAttached: false
      });
    }, 2500);
  };

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setOfflineQueue([]);
      setIsSyncing(false);
    }, 2000);
  };

  return (
    <div style={{ paddingBottom: '70px', minHeight: '100vh', background: '#020617', color: '#f8fafc' }}>
      {/* Header */}
      <div className="header" style={{ background: '#0f172a', borderBottom: '1px solid #1e293b', padding: '0.8rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', sticky: 'top', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={22} color="#10b981" />
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.5px' }}>
            GeoShield <span style={{ color: '#34d399' }}>PWA</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', background: isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: isOnline ? '#34d399' : '#f87171', padding: '0.2rem 0.5rem', borderRadius: '12px', border: `1px solid ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          {isOnline ? 'Live Mesh' : 'Offline Mode'}
        </div>
      </div>

      <div style={{ padding: '1rem' }}>
        {/* Emergency SOS Quick Bar */}
        <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(185,28,28,0.3))', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: 700 }}>Disaster Emergency Hotline</h4>
            <p style={{ fontSize: '0.7rem', color: '#fca5a5' }}>NDRMA Response Cell</p>
          </div>
          <a href="tel:1149" className="btn btn-danger" style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: '#ef4444', color: '#fff', borderRadius: '8px', fontWeight: 600 }}>
            <PhoneCall size={14} /> Call 1149
          </a>
        </div>

        {/* PAGE 1: HOME SCREEN */}
        {activeTab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>CURRENT SECTOR STATUS</span>
                <span style={{ fontSize: '0.7rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: '10px' }}>Kathmandu Slopes</span>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.25rem' }}>Sector 4: High Alert</h3>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cumulative 24h rainfall: <strong style={{ color: '#fbbf24' }}>142mm</strong>. Landslide probability elevated to 78%.</p>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button 
                onClick={() => setActiveTab('report')}
                style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '12px', padding: '1rem', color: '#fff', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '0.5rem' }}
              >
                <AlertTriangle size={24} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Report Incident</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>Geo-tagged observations</div>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('alerts')}
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: 'none', borderRadius: '12px', padding: '1rem', color: '#fff', textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', gap: '0.5rem' }}
              >
                <Bell size={24} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Alert Feed</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>Live evacuation notices</div>
                </div>
              </button>
            </div>

            {/* Live Weather Widget */}
            <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} color="#38bdf8" /> Real-time Weather Telemetry
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Rainfall Rate</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8' }}>14.2 mm/h</div>
                </div>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Soil Moisture</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f59e0b' }}>84.5 %</div>
                </div>
                <div style={{ background: '#1e293b', padding: '0.5rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Wind Speed</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>28 km/h</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: REPORT INCIDENT */}
        {activeTab === 'report' && (
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <AlertTriangle color="#f59e0b" size={18} /> Citizen Incident Reporter
            </h3>

            {submitted ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem 1rem', border: '1px solid #10b981', background: '#0f172a', borderRadius: '12px' }}>
                <CheckCircle size={44} color="#10b981" style={{ margin: '0 auto 0.75rem auto' }} />
                <h4 style={{ color: '#34d399', marginBottom: '0.35rem', fontWeight: 700 }}>Report Transmitted!</h4>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {isOnline ? 'Report submitted directly to NDRMA Live Operations Map.' : 'Saved locally in Sync Center queue. Will transmit automatically.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Sector / Location</label>
                  <select 
                    className="input-control"
                    value={formData.regionId}
                    onChange={(e) => setFormData({ ...formData, regionId: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="KM-NORTH">Kathmandu North Highway (KM 42)</option>
                    <option value="MELAMCHI">Melamchi River Basin Sector</option>
                    <option value="POKHARA">Pokhara Highway Ridge</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Hazard Type</label>
                  <select 
                    className="input-control"
                    value={formData.hazardType}
                    onChange={(e) => setFormData({ ...formData, hazardType: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', color: '#f8fafc', fontSize: '0.8rem' }}
                  >
                    <option value="LANDSLIDE">Active Landslide / Debris Fall</option>
                    <option value="FLASH_FLOOD">Flash Flood / River Breach</option>
                    <option value="ROAD_BLOCK">Road Blockage / Mudslide</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>GPS Location</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      readOnly 
                      value={`${location.lat}, ${location.lng}`} 
                      style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', color: '#94a3b8', fontSize: '0.8rem' }}
                    />
                    <button 
                      type="button" 
                      onClick={getGPS}
                      style={{ background: '#334155', border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    >
                      <MapPin size={14} /> {isLocating ? 'Locating...' : 'GPS Tag'}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Photo Proof</label>
                  <button 
                    type="button" 
                    onClick={() => setFormData({ ...formData, photoAttached: !formData.photoAttached })}
                    style={{ width: '100%', background: '#1e293b', border: `1px solid ${formData.photoAttached ? '#10b981' : '#334155'}`, borderRadius: '8px', padding: '0.55rem', color: formData.photoAttached ? '#34d399' : '#cbd5e1', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}
                  >
                    <Camera size={16} /> {formData.photoAttached ? 'Photo Attached ✓' : 'Capture Photo'}
                  </button>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.35rem' }}>Description</label>
                  <textarea 
                    rows={3} 
                    placeholder="Describe mud thickness, blocked vehicles, trapped persons..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', color: '#f8fafc', fontSize: '0.8rem' }}
                    required
                  />
                </div>

                <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', borderRadius: '8px', padding: '0.65rem', color: '#fff', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer', marginTop: '0.25rem' }}>
                  <Send size={16} /> Transmit Field Observation
                </button>
              </form>
            )}
          </div>
        )}

        {/* PAGE 3: SYNC CENTER */}
        {activeTab === 'sync' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <RefreshCw color="#34d399" size={18} /> Offline Sync Center
              </h3>
              <button 
                onClick={triggerSync}
                disabled={isSyncing || offlineQueue.length === 0}
                style={{ background: '#10b981', border: 'none', borderRadius: '8px', padding: '0.35rem 0.75rem', color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', opacity: offlineQueue.length === 0 ? 0.5 : 1 }}
              >
                {isSyncing ? 'Syncing...' : 'Sync Now'}
              </button>
            </div>

            <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.5rem' }}>
                <span>Queued Submissions:</span>
                <strong style={{ color: '#34d399' }}>{offlineQueue.length} items</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <span>Mesh Peer Sync:</span>
                <strong style={{ color: '#38bdf8' }}>Active (BLE Local)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {offlineQueue.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem' }}>
                  <Check size={32} style={{ margin: '0 auto 0.5rem auto', color: '#34d399' }} />
                  All field data synced with central servers.
                </div>
              ) : (
                offlineQueue.map((item) => (
                  <div key={item.id} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f8fafc' }}>{item.type} Report ({item.id})</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{item.time}</div>
                    </div>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                      {item.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* PAGE 4: ALERT FEED */}
        {activeTab === 'alerts' && (
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <Bell color="#38bdf8" size={18} /> Regional Alert Broadcasts
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="card" style={{ background: '#0f172a', borderLeft: '4px solid #ef4444', borderTop: '1px solid #1e293b', borderRight: '1px solid #1e293b', borderBottom: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#f87171', fontSize: '0.75rem' }}>CRITICAL EVACUATION</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>12m ago</span>
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>Kathmandu North Highway KM 42</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  High-volume debris movement confirmed by ground sensor array S-402. Evacuate lower slopes immediately.
                </p>
              </div>

              <div className="card" style={{ background: '#0f172a', borderLeft: '4px solid #f59e0b', borderTop: '1px solid #1e293b', borderRight: '1px solid #1e293b', borderBottom: '1px solid #1e293b', borderRadius: '8px', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.75rem' }}>FLASH FLOOD WARNING</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>45m ago</span>
                </div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.25rem' }}>Melamchi Basin Embankment</h4>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                  Water levels elevated by 1.2 meters. Emergency crews deployed. Stay tuned for relief camp locations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 5: USER PROFILE */}
        {activeTab === 'profile' && (
          <div>
            <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
              <User color="#34d399" size={18} /> First Responder Profile
            </h3>

            <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', textAlignment: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', fontWeight: 800, margin: '0 auto 0.5rem auto' }}>
                KS
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Inspector K. Sharma</h4>
              <p style={{ fontSize: '0.75rem', color: '#34d399' }}>Lead Field Evaluator - Sector 4</p>
              <div style={{ marginTop: '0.5rem', display: 'inline-flex', gap: '4px', background: 'rgba(52,211,153,0.1)', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', color: '#34d399' }}>
                <Shield size={12} /> Verified Commander ID #8841
              </div>
            </div>

            <div className="card" style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1rem' }}>
              <h4 style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>FIELD ACTIVITY SUMMARY</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Total Submitted</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>24 Reports</div>
                </div>
                <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Accuracy Rating</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>98.4%</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom PWA Navigation Bar (5 Icons for 5 Mobile Pages) */}
      <div className="nav-bar" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#0f172a', borderTop: '1px solid #1e293b', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '0.4rem 0', zIndex: 50 }}>
        <button 
          style={{ background: 'none', border: 'none', color: activeTab === 'home' ? '#34d399' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('home')}
        >
          <Home size={18} />
          Home
        </button>

        <button 
          style={{ background: 'none', border: 'none', color: activeTab === 'report' ? '#34d399' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('report')}
        >
          <AlertTriangle size={18} />
          Report
        </button>

        <button 
          style={{ background: 'none', border: 'none', color: activeTab === 'sync' ? '#34d399' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('sync')}
        >
          <RefreshCw size={18} />
          Sync
        </button>

        <button 
          style={{ background: 'none', border: 'none', color: activeTab === 'alerts' ? '#34d399' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('alerts')}
        >
          <Bell size={18} />
          Alerts
        </button>

        <button 
          style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#34d399' : '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', fontSize: '0.65rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} />
          Profile
        </button>
      </div>
    </div>
  );
}
