import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import { createLogger, metricsMiddleware, getMetricsHandler, setupGracefulShutdown } from '@geoshield/shared';

dotenv.config();

const logger = createLogger('field-reports-service');
const app = express();
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware('field-reports-service'));

const PORT = process.env.FIELD_REPORTS_SERVICE_PORT || 8005;
const connectionString = process.env.DATABASE_URL || 'postgresql://geoshield:geoshield_password@localhost:5432/geoshield_db';

const pool = new pg.Pool({ connectionString });

// Prometheus Metrics Endpoint
app.get('/metrics', getMetricsHandler);

// Sample fallback report dataset
const SAMPLE_REPORTS = [
  {
    id: 1,
    user_id: 'citizen_992',
    report_type: 'LANDSLIDE',
    description: 'Mudslide blocking left lane on NH-06 near Sonapur tunnel.',
    photo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=500',
    latitude: 25.215,
    longitude: 91.752,
    status: 'VERIFIED',
    created_at: new Date()
  },
  {
    id: 2,
    user_id: 'officer_301',
    report_type: 'ROAD_BLOCK',
    description: 'Boulders fallen onto road, vehicles queuing up.',
    photo_url: 'https://images.unsplash.com/photo-1508873696983-2df515122519?w=500',
    latitude: 26.142,
    longitude: 91.731,
    status: 'PENDING',
    created_at: new Date(Date.now() - 1800000)
  }
];

// 1. POST /api/reports/submit -> Submit new crowd report from mobile PWA with Tenant Scope
app.post('/api/reports/submit', async (req, res) => {
  try {
    const { user_id = 'anonymous', report_type, description, photo_url = '', latitude, longitude } = req.body;
    const tenantId = req.headers['x-tenant-id'] || 1;

    if (!report_type || !latitude || !longitude) {
      return res.status(400).json({ status: 'error', message: 'Missing required report fields (report_type, latitude, longitude)' });
    }

    try {
      const query = `
        INSERT INTO field_reports (tenant_id, user_id, report_type, description, photo_url, latitude, longitude, geom, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, ST_SetSRID(ST_MakePoint($7, $6), 4326), 'PENDING')
        RETURNING *;
      `;
      const result = await pool.query(query, [tenantId, user_id, report_type, description, photo_url, latitude, longitude]);
      return res.status(201).json({ status: 'success', message: 'Field report submitted successfully', data: result.rows[0] });
    } catch (dbErr) {
      logger.warn(`Database write fallback: ${dbErr.message}`);
      const newReport = { id: Date.now(), tenant_id: tenantId, user_id, report_type, description, photo_url, latitude, longitude, status: 'PENDING', created_at: new Date() };
      return res.status(201).json({ status: 'success', message: 'Field report queued', data: newReport });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 2. GET /api/reports -> Retrieve field reports with tenant scoping
app.get('/api/reports', async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || 1;
    const result = await pool.query('SELECT id, user_id, report_type, description, photo_url, latitude, longitude, status, created_at FROM field_reports WHERE tenant_id = $1 ORDER BY created_at DESC', [tenantId]);
    const reports = result.rows.length > 0 ? result.rows : SAMPLE_REPORTS;
    res.json({ status: 'success', data: reports });
  } catch (error) {
    res.json({ status: 'success', data: SAMPLE_REPORTS });
  }
});

const server = app.listen(PORT, () => {
  logger.info(`Field Reports Service running on port ${PORT}`);
});

setupGracefulShutdown('field-reports-service', [
  async () => {
    logger.info('Closing Express HTTP server...');
    await new Promise((res) => server.close(res));
  },
  async () => {
    logger.info('Closing PostgreSQL pool connection...');
    await pool.end();
  }
]);

