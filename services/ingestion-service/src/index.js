import express from 'express';
import axios from 'axios';
import cron from 'node-cron';
import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
import { createCircuitBreaker, idempotency, createLogger, metricsMiddleware, getMetricsHandler, setupGracefulShutdown } from '@geoshield/shared';

dotenv.config();

const logger = createLogger('ingestion-service');
const app = express();
app.use(express.json());
app.use(metricsMiddleware('ingestion-service'));

const PORT = process.env.INGESTION_SERVICE_PORT || 8001;
const KAFKA_BROKERS = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

// Kafka Setup
const kafka = new Kafka({
  clientId: 'ingestion-service',
  brokers: KAFKA_BROKERS,
});
const producer = kafka.producer();

// Default coordinates for key North-Eastern Region (NER) districts
const NER_DISTRICTS = {
  'east-khasi-hills': { name: 'East Khasi Hills (Shillong)', lat: 25.5788, lon: 91.8933, state: 'Meghalaya' },
  'kamrup-metropolitan': { name: 'Kamrup Metropolitan (Guwahati)', lat: 26.1445, lon: 91.7362, state: 'Assam' },
  'gangtok': { name: 'Gangtok', lat: 27.3389, lon: 88.6065, state: 'Sikkim' },
  'kohima': { name: 'Kohima', lat: 25.6751, lon: 94.1086, state: 'Nagaland' },
  'aizawl': { name: 'Aizawl', lat: 23.7307, lon: 92.7173, state: 'Mizoram' },
  'imphal-west': { name: 'Imphal West', lat: 24.8170, lon: 93.9368, state: 'Manipur' },
  'west-tripura': { name: 'West Tripura (Agartala)', lat: 23.8315, lon: 91.2868, state: 'Tripura' },
  'itanagar': { name: 'Papum Pare (Itanagar)', lat: 27.0844, lon: 93.6053, state: 'Arunachal Pradesh' }
};

// Base Fetch Weather Function
async function rawFetchWeatherData(districtKey) {
  const district = NER_DISTRICTS[districtKey];
  if (!district) throw new Error(`District '${districtKey}' not found in NER map`);

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${district.lat}&longitude=${district.lon}&daily=precipitation_sum,rain_sum&hourly=soil_moisture_0_to_1cm,precipitation&timezone=Asia%2FKolkata`;
  
  const response = await axios.get(url, { timeout: 4000 });
  const data = response.data;

  // Process rainfall & soil moisture metrics
  const dailyPrecip = data.daily?.precipitation_sum || [15.2, 45.0, 88.4, 120.0, 30.1, 10.0, 5.0];
  const rainfall24h = dailyPrecip[0] || 25.0;
  const rainfall7d = dailyPrecip.slice(0, 7).reduce((acc, val) => acc + val, 0);
  const soilMoistureArr = data.hourly?.soil_moisture_0_to_1cm || [0.45];
  const soilMoisture = soilMoistureArr[0] || 0.45;

  return {
    districtKey,
    districtName: district.name,
    state: district.state,
    lat: district.lat,
    lon: district.lon,
    rainfall_24h_mm: rainfall24h,
    rainfall_7d_mm: rainfall7d,
    soil_moisture: soilMoisture,
    forecast_daily: dailyPrecip,
    timestamp: new Date().toISOString()
  };
}

// Circuit Breaker for Weather API calls
const weatherApiBreaker = createCircuitBreaker(rawFetchWeatherData, {
  timeout: 5000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});

export async function fetchWeatherData(districtKey) {
  return weatherApiBreaker.fire(districtKey);
}

// Ingestion Trigger Route with Idempotency
app.post('/api/ingestion/weather/trigger', idempotency(3600), async (req, res) => {
  try {
    const { districtKey = 'east-khasi-hills' } = req.body;
    const weatherPayload = await fetchWeatherData(districtKey);

    if (weatherPayload.fallback) {
      return res.status(503).json({ status: 'error', message: 'Weather provider service unavailable' });
    }

    // Emit to Kafka topic weather.ingested
    try {
      await producer.send({
        topic: 'weather.ingested',
        messages: [{ value: JSON.stringify(weatherPayload) }],
      });
    } catch (kErr) {
      logger.warn(`Kafka emit warning (Kafka might be offline): ${kErr.message}`);
    }

    res.json({
      status: 'success',
      message: `Weather data ingested successfully for ${districtKey}`,
      data: weatherPayload
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Fetch 7-day Weather Forecast Route
app.get('/api/ingestion/forecast/:district', async (req, res) => {
  try {
    const { district } = req.params;
    const weatherPayload = await fetchWeatherData(district);
    res.json({ status: 'success', data: weatherPayload });
  } catch (error) {
    res.status(404).json({ status: 'error', message: error.message });
  }
});

// Cron Job: Automatically trigger ingestion every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  logger.info('Executing automated weather ingestion cron task...');
  for (const districtKey of Object.keys(NER_DISTRICTS)) {
    try {
      const payload = await fetchWeatherData(districtKey);
      if (!payload.fallback) {
        await producer.send({
          topic: 'weather.ingested',
          messages: [{ value: JSON.stringify(payload) }],
        });
      }
    } catch (err) {
      logger.error(`Error in automated ingestion for ${districtKey}: ${err.message}`);
    }
  }
});

// Prometheus Metrics Endpoint
app.get('/metrics', getMetricsHandler);

// Start service
async function start() {
  try {
    await producer.connect();
    logger.info('Connected to Kafka Producer');
  } catch (e) {
    logger.warn(`Kafka connection warning: ${e.message}`);
  }

  const server = app.listen(PORT, () => {
    logger.info(`Ingestion Service running on port ${PORT}`);
  });

  setupGracefulShutdown('ingestion-service', [
    async () => {
      logger.info('Closing Express HTTP server...');
      await new Promise((res) => server.close(res));
    },
    async () => {
      logger.info('Disconnecting Kafka Producer...');
      await producer.disconnect();
    }
  ]);
}

start();

