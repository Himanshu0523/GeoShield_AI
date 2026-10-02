import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import { createLogger, metricsMiddleware, getMetricsHandler, setupGracefulShutdown } from '@geoshield/shared';

dotenv.config();

const logger = createLogger('spatial-service');
const app = express();
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware('spatial-service'));

const PORT = process.env.SPATIAL_SERVICE_PORT || 8002;
const connectionString = process.env.DATABASE_URL || 'postgresql://geoshield:geoshield_password@localhost:5432/geoshield_db';

const pool = new pg.Pool({ connectionString });

// Prometheus Metrics Endpoint
app.get('/metrics', getMetricsHandler);

// Sample GeoJSON fallback data for NER regions when DB is empty/seeding
const SAMPLE_NER_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 1,
        region_code: 'NER-EKH-01',
        name: 'Cherrapunji (Sohra)',
        district: 'East Khasi Hills',
        state: 'Meghalaya',
        population: 14829,
        slope_deg: 38.5,
        risk_score: 0.85,
        risk_level: 'CRITICAL'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[91.7, 25.2], [91.8, 25.2], [91.8, 25.3], [91.7, 25.3], [91.7, 25.2]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 2,
        region_code: 'NER-KAM-02',
        name: 'Guwahati Hills (Kamrup)',
        district: 'Kamrup Metropolitan',
        state: 'Assam',
        population: 957352,
        slope_deg: 24.0,
        risk_score: 0.62,
        risk_level: 'HIGH'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[91.7, 26.1], [91.8, 26.1], [91.8, 26.2], [91.7, 26.2], [91.7, 26.1]]]
      }
    },
    {
      type: 'Feature',
      properties: {
        id: 3,
        region_code: 'NER-GAN-03',
        name: 'Gangtok Ridge',
        district: 'Gangtok',
        state: 'Sikkim',
        population: 100286,
        slope_deg: 42.1,
        risk_score: 0.40,
        risk_level: 'MODERATE'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[[88.5, 27.3], [88.7, 27.3], [88.7, 27.4], [88.5, 27.4], [88.5, 27.3]]]
      }
    }
  ]
};

// 1. GET /api/regions/geojson -> Regional GeoJSON layer with risk overlay and tenant scoping
app.get('/api/regions/geojson', async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || 1;
    const query = `
      SELECT jsonb_build_object(
        'type', 'FeatureCollection',
        'features', jsonb_agg(
          jsonb_build_object(
            'type', 'Feature',
            'id', r.id,
            'geometry', ST_AsGeoJSON(r.geom)::jsonb,
            'properties', jsonb_build_object(
              'id', r.id,
              'region_code', r.region_code,
              'name', r.name,
              'district', r.district,
              'state', r.state,
              'population', r.population,
              'slope_deg', r.slope_deg,
              'risk_score', COALESCE(re.risk_score, 0.15),
              'risk_level', COALESCE(re.risk_level, 'LOW')
            )
          )
        )
      ) AS geojson
      FROM regions r
      LEFT JOIN LATERAL (
        SELECT risk_score, risk_level 
        FROM risk_events 
        WHERE region_id = r.id 
        ORDER BY timestamp DESC LIMIT 1
      ) re ON true
      WHERE r.tenant_id = $1;
    `;
    const result = await pool.query(query, [tenantId]);
    const geojson = result.rows[0]?.geojson?.features ? result.rows[0].geojson : SAMPLE_NER_GEOJSON;
    res.json(geojson);
  } catch (error) {
    logger.warn(`Database query fallback to sample GeoJSON: ${error.message}`);
    res.json(SAMPLE_NER_GEOJSON);
  }
});

// 2. GET /api/regions/:id/detail -> Detailed metadata + risk event history
app.get('/api/regions/:id/detail', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.headers['x-tenant-id'] || 1;
    const regionRes = await pool.query('SELECT id, region_code, name, district, state, population, slope_deg, soil_type FROM regions WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
    const historyRes = await pool.query('SELECT risk_score, risk_level, rainfall_24h_mm, rainfall_7d_mm, soil_moisture, timestamp FROM risk_events WHERE region_id = $1 ORDER BY timestamp DESC LIMIT 10', [id]);

    if (regionRes.rows.length === 0) {
      return res.json({
        status: 'success',
        data: {
          region: { id, name: 'Cherrapunji (Sohra)', district: 'East Khasi Hills', state: 'Meghalaya', slope_deg: 38.5, population: 14829 },
          history: [
            { risk_score: 0.85, risk_level: 'CRITICAL', rainfall_24h_mm: 120.5, rainfall_7d_mm: 310.2, timestamp: new Date() }
          ]
        }
      });
    }

    res.json({
      status: 'success',
      data: {
        region: regionRes.rows[0],
        history: historyRes.rows
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 3. GET /api/roads/status -> Major roads status and isolated villages analysis
app.get('/api/roads/status', async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || 1;
    const query = `SELECT id, road_name, district, status, updated_at FROM roads WHERE tenant_id = $1 ORDER BY updated_at DESC`;
    const result = await pool.query(query, [tenantId]);

    const roads = result.rows.length > 0 ? result.rows : [
      { id: 1, road_name: 'NH-06 (Shillong-Silchar Highway)', district: 'East Khasi Hills', status: 'AT_RISK', isolated_villages: ['Sonapur', 'Ratacherra'] },
      { id: 2, road_name: 'NH-27 (Guwahati Bypass)', district: 'Kamrup Metropolitan', status: 'OPEN', isolated_villages: [] },
      { id: 3, road_name: 'NH-10 (Gangtok-Siliguri Highway)', district: 'Gangtok', status: 'BLOCKED', isolated_villages: ['Rangpo', 'Singtam'] }
    ];

    res.json({ status: 'success', data: roads });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const server = app.listen(PORT, () => {
  logger.info(`Spatial Service running on port ${PORT}`);
});

setupGracefulShutdown('spatial-service', [
  async () => {
    logger.info('Closing Express HTTP server...');
    await new Promise((res) => server.close(res));
  },
  async () => {
    logger.info('Closing PostgreSQL pool connection...');
    await pool.end();
  }
]);

