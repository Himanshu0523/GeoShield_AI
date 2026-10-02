import { Router } from 'express';

const router = Router();

const MOCK_ALERTS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [88.55, 27.53] },
      properties: {
        id: 'ALT-8902',
        title: 'Critical Flash Flood Warning: Teesta River Basin',
        severity: 'critical',
        region: 'Northern Sikkim (Sector 4)',
        timestamp: '3m ago',
        status: 'active'
      }
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [88.22, 27.28] },
      properties: {
        id: 'ALT-8899',
        title: 'Active Debris Flow / Landslide on Western Ridge Pass',
        severity: 'critical',
        region: 'Western Ridge (Pass 9)',
        timestamp: '14m ago',
        status: 'active'
      }
    }
  ]
};

let alertsList = [
  {
    id: 'ALT-8902',
    title: 'Critical Flash Flood Warning: Teesta River Basin',
    description: 'Water levels exceeded warning threshold by 1.8m at Chungthang station.',
    severity: 'critical',
    region: 'Northern Sikkim (Sector 4)',
    timestamp: '3m ago',
    status: 'active',
    source: 'IMD Doppler & River Telemetry'
  },
  {
    id: 'ALT-8899',
    title: 'Active Debris Flow / Landslide on Western Ridge Pass',
    description: 'Slopemeter sensor SL-09 detected 42mm displacement in 10 mins.',
    severity: 'critical',
    region: 'Western Ridge (Pass 9)',
    timestamp: '14m ago',
    status: 'active',
    source: 'Geotechnical Slopemeter Grid'
  },
  {
    id: 'ALT-8894',
    title: 'Culvert Silt Blockage & Water Logging Hazard',
    description: 'Field report FR-104 confirmed 80% culvert capacity blockage.',
    severity: 'warning',
    region: 'Eastern Valley (Lowlands)',
    timestamp: '38m ago',
    status: 'acknowledged',
    source: 'Mobile Field Patrol'
  }
];

// GET /api/alerts
router.get('/', (req, res) => {
  res.json(alertsList);
});

// GET /api/alerts.geojson
router.get('/alerts.geojson', (req, res) => {
  res.json(MOCK_ALERTS_GEOJSON);
});

// POST /api/alerts/broadcast
router.post('/broadcast', (req, res) => {
  const { title, description, severity, region } = req.body;
  const newAlert = {
    id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
    title: title || 'Emergency Hazard Advisory',
    description: description || 'Mandatory caution in effect.',
    severity: severity || 'critical',
    region: region || 'Northern Sikkim (Sector 4)',
    timestamp: 'Just now',
    status: 'active',
    source: 'Command Center Broadcast'
  };
  alertsList.unshift(newAlert);
  res.status(201).json({ message: 'Broadcast dispatched', alert: newAlert });
});

// POST /api/alerts/:id/acknowledge
router.post('/:id/acknowledge', (req, res) => {
  const { id } = req.params;
  alertsList = alertsList.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a);
  res.json({ message: 'Alert acknowledged', id });
});

// POST /api/alerts/:id/resolve
router.post('/:id/resolve', (req, res) => {
  const { id } = req.params;
  alertsList = alertsList.map(a => a.id === id ? { ...a, status: 'resolved' } : a);
  res.json({ message: 'Alert resolved', id });
});

export default router;
