import { Router } from 'express';

const router = Router();

const MOCK_REGIONS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'NER-EKH-01',
      geometry: { 
        type: 'Polygon', 
        coordinates: [[[91.70, 25.20], [91.80, 25.20], [91.80, 25.30], [91.70, 25.30], [91.70, 25.20]]] 
      },
      properties: { 
        id: 'NER-EKH-01', 
        name: 'Cherrapunji (Sohra)', 
        district: 'East Khasi Hills',
        state: 'Meghalaya',
        risk_level: 'CRITICAL', 
        risk_score: 0.85, 
        population: '14,829', 
        slope_deg: 38.5,
        details: 'Extreme precipitation vector. Active landslide warning.'
      }
    },
    {
      type: 'Feature',
      id: 'NER-KAM-02',
      geometry: { 
        type: 'Polygon', 
        coordinates: [[[91.70, 26.10], [91.80, 26.10], [91.80, 26.20], [91.70, 26.20], [91.70, 26.10]]] 
      },
      properties: { 
        id: 'NER-KAM-02', 
        name: 'Guwahati Hills (Kamrup)', 
        district: 'Kamrup Metropolitan',
        state: 'Assam',
        risk_level: 'HIGH', 
        risk_score: 0.62, 
        population: '957,352', 
        slope_deg: 24.0,
        details: 'Urban slope flash flood vector. Road NH-27 bypass monitoring active.'
      }
    },
    {
      type: 'Feature',
      id: 'NER-GAN-03',
      geometry: { 
        type: 'Polygon', 
        coordinates: [[[88.50, 27.30], [88.70, 27.30], [88.70, 27.40], [88.50, 27.40], [88.50, 27.30]]] 
      },
      properties: { 
        id: 'NER-GAN-03', 
        name: 'Gangtok Ridge', 
        district: 'Gangtok',
        state: 'Sikkim',
        risk_level: 'MODERATE', 
        risk_score: 0.40, 
        population: '100,286', 
        slope_deg: 42.1,
        details: 'High steepness (42.1°), moderate rainfall threshold.'
      }
    }
  ]
};

const MOCK_REGIONS = [
  { id: 'NER-EKH-01', name: 'Cherrapunji (Sohra)', code: 'NER-EKH-01', population: '14,829', riskScore: 85, riskLevel: 'CRITICAL', alertsCount: 3, roadsBlocked: 1 },
  { id: 'NER-KAM-02', name: 'Guwahati Hills (Kamrup)', code: 'NER-KAM-02', population: '957,352', riskScore: 62, riskLevel: 'HIGH', alertsCount: 2, roadsBlocked: 0 },
  { id: 'NER-GAN-03', name: 'Gangtok Ridge', code: 'NER-GAN-03', population: '100,286', riskScore: 40, riskLevel: 'MODERATE', alertsCount: 1, roadsBlocked: 1 }
];

// GET /api/regions
router.get('/', (req, res) => {
  res.json(MOCK_REGIONS);
});

// GET /api/regions.geojson & /api/regions/geojson
router.get('/regions.geojson', (req, res) => {
  res.json(MOCK_REGIONS_GEOJSON);
});

router.get('/geojson', (req, res) => {
  res.json(MOCK_REGIONS_GEOJSON);
});

// GET /api/regions/:id/geometry
router.get('/:id/geometry', (req, res) => {
  const { id } = req.params;
  const match = MOCK_REGIONS_GEOJSON.features.find(f => f.id.toLowerCase() === id.toLowerCase());
  res.json({
    type: 'FeatureCollection',
    features: match ? [match] : MOCK_REGIONS_GEOJSON.features
  });
});

// GET /api/regions/:id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const reg = MOCK_REGIONS.find(r => r.id.toLowerCase() === id.toLowerCase()) || MOCK_REGIONS[0];
  res.json({
    region: reg,
    alerts: [
      { id: 'ALT-8902', title: 'Critical Flash Flood Warning', severity: 'critical', timestamp: '3m ago' }
    ],
    roads: [
      { id: 'RD-NH10', name: 'NH-10 Sector 4', status: 'blocked' }
    ],
    reports: [
      { id: 'FR-104', reporter: 'Inspector Rawat', hazardType: 'Culvert Silt Blockage', timestamp: '25m ago' }
    ]
  });
});

export default router;
