import { Router } from 'express';
import authRoutes from './auth.routes.js';
import alertsRoutes from './alerts.routes.js';
import regionsRoutes from './regions.routes.js';
import roadsRoutes from './roads.routes.js';
import forecastRoutes from './forecast.routes.js';
import fieldReportsRoutes from './fieldReports.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

// Dedicated .geojson aliases
router.use('/regions.geojson', (req, res, next) => {
  req.url = '/geojson';
  regionsRoutes(req, res, next);
});
router.use('/roads.geojson', (req, res, next) => {
  req.url = '/geojson';
  roadsRoutes(req, res, next);
});
router.use('/alerts.geojson', (req, res, next) => {
  req.url = '/geojson';
  alertsRoutes(req, res, next);
});

router.use('/auth', authRoutes);
router.use('/alerts', alertsRoutes);
router.use('/regions', regionsRoutes);
router.use('/roads', roadsRoutes);
router.use('/forecast', forecastRoutes);
router.use('/reports', fieldReportsRoutes);
router.use('/field-reports', fieldReportsRoutes);
router.use('/admin', adminRoutes);

// Direct /me route alias
router.use('/me', (req, res, next) => {
  req.url = '/me';
  authRoutes(req, res, next);
});

export default router;
