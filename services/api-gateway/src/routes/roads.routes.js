import { Router } from 'express';

const router = Router();

const MOCK_ROADS_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'RD-NH06',
      geometry: { type: 'LineString', coordinates: [[91.72, 25.22], [91.78, 25.27], [91.82, 25.32]] },
      properties: { id: 'RD-NH06', name: 'NH-06 Shillong-Silchar Highway', status: 'at_risk', riskScore: 78, district: 'East Khasi Hills' }
    },
    {
      type: 'Feature',
      id: 'RD-NH10',
      geometry: { type: 'LineString', coordinates: [[88.52, 27.32], [88.60, 27.35], [88.68, 27.38]] },
      properties: { id: 'RD-NH10', name: 'NH-10 Gangtok-Siliguri Highway', status: 'blocked', riskScore: 94, district: 'Gangtok' }
    },
    {
      type: 'Feature',
      id: 'RD-NH27',
      geometry: { type: 'LineString', coordinates: [[91.68, 26.12], [91.75, 26.15], [91.82, 26.18]] },
      properties: { id: 'RD-NH27', name: 'NH-27 Guwahati Bypass', status: 'open', riskScore: 22, district: 'Kamrup Metropolitan' }
    }
  ]
};

const MOCK_ROADS = [
  { id: 'RD-NH06', name: 'NH-06 Shillong-Silchar Highway', region: 'East Khasi Hills', status: 'at_risk', riskScore: 78, lastInspection: '1h ago', isolatedVillages: 2 },
  { id: 'RD-NH10', name: 'NH-10 Gangtok-Siliguri Highway', region: 'Gangtok', status: 'blocked', riskScore: 94, lastInspection: '30m ago', isolatedVillages: 4 },
  { id: 'RD-NH27', name: 'NH-27 Guwahati Bypass', region: 'Kamrup Metropolitan', status: 'open', riskScore: 22, lastInspection: '2h ago', isolatedVillages: 0 }
];

// GET /api/roads
router.get('/', (req, res) => {
  res.json(MOCK_ROADS);
});

// GET /api/roads.geojson & /api/roads/geojson
router.get('/roads.geojson', (req, res) => {
  res.json(MOCK_ROADS_GEOJSON);
});

router.get('/geojson', (req, res) => {
  res.json(MOCK_ROADS_GEOJSON);
});

export default router;
