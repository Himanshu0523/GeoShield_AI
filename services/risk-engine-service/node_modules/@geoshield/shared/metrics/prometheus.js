import client from 'prom-client';

// Collect default Node.js process metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom HTTP Request Duration Histogram
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code', 'service'],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 3, 5]
});
register.registerMetric(httpRequestDurationMicroseconds);

// Custom Ingestion Events Counter
export const telemetryIngestedTotal = new client.Counter({
  name: 'telemetry_ingested_total',
  help: 'Total telemetry payloads ingested',
  labelNames: ['district', 'status']
});
register.registerMetric(telemetryIngestedTotal);

// Custom Landslide Risk Score Gauge
export const landslideRiskGauge = new client.Gauge({
  name: 'landslide_risk_score',
  help: 'Latest computed landslide risk score per region',
  labelNames: ['region_id', 'district']
});
register.registerMetric(landslideRiskGauge);

/**
 * Middleware to measure request duration and expose /metrics endpoint
 */
export const metricsMiddleware = (serviceName) => {
  return (req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      end({
        method: req.method,
        route: req.route ? req.route.path : req.path,
        code: res.statusCode,
        service: serviceName
      });
    });
    next();
  };
};

export const getMetricsHandler = async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
};
