import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.js';
import { 
  createLogger, 
  metricsMiddleware, 
  getMetricsHandler,
  setupGracefulShutdown
} from '@geoshield/shared';

dotenv.config();

const logger = createLogger('api-gateway');
const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'x-user-id']
}));

app.use(express.json());
app.use(metricsMiddleware('api-gateway'));

const PORT = process.env.API_GATEWAY_PORT || 8000;

// Microservice Route Proxies
const INGESTION_SERVICE = process.env.INGESTION_SERVICE_URL || 'http://localhost:8001';
const SPATIAL_SERVICE = process.env.SPATIAL_SERVICE_URL || 'http://localhost:8002';
const RISK_ENGINE_SERVICE = process.env.RISK_ENGINE_SERVICE_URL || 'http://localhost:8003';
const ALERT_SERVICE = process.env.ALERT_SERVICE_URL || 'http://localhost:8004';
const STREAM_SERVICE = process.env.STREAM_SERVICE_URL || 'http://localhost:8005';
const FIELD_REPORTS_SERVICE = process.env.FIELD_REPORTS_SERVICE_URL || 'http://localhost:8006';

// Prometheus Metrics Endpoint
app.get('/metrics', getMetricsHandler);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    gateway: 'GeoShield AI API Gateway',
    timestamp: new Date().toISOString(),
    services: {
      ingestion: INGESTION_SERVICE,
      spatial: SPATIAL_SERVICE,
      risk_engine: RISK_ENGINE_SERVICE,
      alert: ALERT_SERVICE,
      stream: STREAM_SERVICE,
      field_reports: FIELD_REPORTS_SERVICE
    }
  });
});

// Mounted Direct Routes & Root Aliases
app.use('/api', apiRoutes);
app.use('/', apiRoutes); // Direct root fallback for /auth, /regions, /me, etc.

// Stream Service Proxy for Socket.io Handshake
app.use('/socket.io', proxy(STREAM_SERVICE, {
  proxyReqPathResolver: (req) => `/socket.io${req.url}`,
}));

const server = httpServer.listen(PORT, () => {
  logger.info(`🛡️ GeoShield AI API Gateway listening on port ${PORT}`);
});

setupGracefulShutdown('api-gateway', [
  async () => {
    logger.info('Closing Express HTTP server...');
    await new Promise((res) => server.close(res));
  }
]);
