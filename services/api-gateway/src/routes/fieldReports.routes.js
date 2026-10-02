import { Router } from 'express';

const router = Router();

let mockReports = [
  {
    id: 'FR-104',
    reporter: 'Inspector S. Rawat (SDRF)',
    region: 'Eastern Valley (Lowlands)',
    hazardType: 'Culvert Silt Blockage',
    severity: 'warning',
    status: 'new',
    coordinates: [88.62, 27.32],
    timestamp: '25m ago',
    description: 'Culvert clogged with silt and rock debris. Overflowing onto State Highway 3B.'
  },
  {
    id: 'FR-103',
    reporter: 'Officer T. Lepcha',
    region: 'Western Ridge (Pass 9)',
    hazardType: 'Active Slope Creep',
    severity: 'critical',
    status: 'verified',
    coordinates: [88.22, 27.28],
    timestamp: '1h 10m ago',
    description: 'Tension cracks appearing along upper road embankment. 50mm displacement observed.'
  }
];

// GET /api/reports
router.get('/', (req, res) => {
  res.json(mockReports);
});

// POST /api/reports
router.post('/', (req, res) => {
  const { reporter, region, hazardType, severity, description, coordinates } = req.body;
  const newReport = {
    id: `FR-${Math.floor(100 + Math.random() * 900)}`,
    reporter: reporter || 'Field Officer',
    region: region || 'Northern Sikkim (Sector 4)',
    hazardType: hazardType || 'Road Obstruction',
    severity: severity || 'warning',
    status: 'new',
    coordinates: coordinates || [88.55, 27.53],
    timestamp: 'Just now',
    description: description || 'Ground observation report submitted.'
  };
  mockReports.unshift(newReport);
  res.status(201).json({ message: 'Field report submitted', report: newReport });
});

// POST /api/reports/:id/verify
router.post('/:id/verify', (req, res) => {
  const { id } = req.params;
  mockReports = mockReports.map(r => r.id === id ? { ...r, status: 'verified' } : r);
  res.json({ message: 'Field report verified', id });
});

export default router;
