import { Router } from 'express';

const router = Router();

// GET /api/forecast?range=7d
router.get('/', (req, res) => {
  const { range = '7d' } = req.query;

  const forecastData = [
    { date: 'Day 1 (+6h)', rainfall: 35.2, riverLevel: 1.4, risk: 42, confidence: 94 },
    { date: 'Day 2 (+12h)', rainfall: 58.0, riverLevel: 1.7, risk: 65, confidence: 91 },
    { date: 'Day 3 (+24h)', rainfall: 82.5, riverLevel: 2.1, risk: 88, confidence: 87 },
    { date: 'Day 4 (+48h)', rainfall: 110.0, riverLevel: 2.5, risk: 94, confidence: 82 },
    { date: 'Day 5 (+72h)', rainfall: 65.0, riverLevel: 2.0, risk: 72, confidence: 78 },
    { date: 'Day 6 (+96h)', rainfall: 40.0, riverLevel: 1.6, risk: 50, confidence: 75 },
    { date: 'Day 7 (+120h)', rainfall: 22.0, riverLevel: 1.2, risk: 30, confidence: 70 },
  ];

  res.json(forecastData);
});

export default router;
