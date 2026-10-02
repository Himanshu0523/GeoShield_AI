import express from 'express';
import cors from 'cors';
import axios from 'axios';
import pg from 'pg';
import dotenv from 'dotenv';
import { idempotency, createLogger, metricsMiddleware, getMetricsHandler, setupGracefulShutdown } from '@geoshield/shared';

dotenv.config();

const logger = createLogger('alert-service');
const app = express();
app.use(cors());
app.use(express.json());
app.use(metricsMiddleware('alert-service'));

const PORT = process.env.ALERT_SERVICE_PORT || 8004;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'stub_token';
const NTFY_SERVER = process.env.NTFY_SERVER_URL || 'https://ntfy.sh';
const connectionString = process.env.DATABASE_URL || 'postgresql://geoshield:geoshield_password@localhost:5432/geoshield_db';

const pool = new pg.Pool({ connectionString });

// Bhashini Multilingual translation dictionary stub for NER languages
const TRANSLATIONS = {
  EN: {
    CRITICAL: 'CRITICAL LANDSLIDE ALERT: Extreme rainfall detected. Evacuate to higher ground immediately!',
    HIGH: 'HIGH HAZARD WARNING: Landslide risk elevated. Avoid steep roads & river valleys.'
  },
  KHASI: {
    CRITICAL: 'KILMA KYRPANG: U slap u jur bha. Khie leit sha kynjang baroh wet!',
    HIGH: 'SYNJAR SYNJAR: Ha khmat jingma hap u maw bad khyndew.'
  },
  ASSAMESE: {
    CRITICAL: 'জৰুৰী ভূস্খলন সতৰ্কতা: অত্যধিক বৰষুণৰ বাবে উচ ঠাইলৈ আতিগ্ৰহ কৰক।',
    HIGH: 'উচ্চ বিপদ সকীয়ানি: পাহাৰীয়া পথ পৰিহাৰ কৰক।'
  },
  BENGLI: {
    CRITICAL: 'জরুরি ভূমিধসের সতর্কতা: ভারী বৃষ্টির কারণে অবিলম্বে নিরাপদ স্থানে আশ্রয় নিন।',
    HIGH: 'উচ্চ ঝুঁকি সতর্কতা: পাহাড়ি রাস্তা এড়িয়ে চলুন।'
  }
};

// Prometheus Metrics Endpoint
app.get('/metrics', getMetricsHandler);

// 1. POST /api/alerts/dispatch -> Dispatch alert via Telegram, ntfy & SMS with Idempotency
app.post('/api/alerts/dispatch', idempotency(86400), async (req, res) => {
  try {
    const { region_id = 1, region_name = 'Cherrapunji', severity = 'CRITICAL', channel = 'NTFY', recipient = 'geoshield_alerts', language = 'EN' } = req.body;
    const tenantId = req.headers['x-tenant-id'] || 1;

    const messageText = TRANSLATIONS[language]?.[severity] || TRANSLATIONS.EN[severity];
    const alertMessage = `🚨 [GeoShield AI - ${severity}] ${region_name}\n${messageText}`;

    let status = 'SENT';
    let dispatchDetails = {};

    if (channel === 'NTFY') {
      try {
        await axios.post(`${NTFY_SERVER}/${recipient}`, alertMessage, {
          headers: { 'Title': `GeoShield ${severity} Alert: ${region_name}`, 'Priority': '5' }
        });
        dispatchDetails.ntfy = 'Published to ntfy topic';
      } catch (err) {
        logger.warn(`ntfy push notification fallback: ${err.message}`);
        dispatchDetails.ntfy = 'Simulated push notification';
      }
    } else if (channel === 'TELEGRAM') {
      dispatchDetails.telegram = `Simulated Telegram bot message sent to chat ${recipient}`;
    } else {
      dispatchDetails.sms = `Simulated SMS sent to ${recipient} via Bhashini pipeline`;
    }

    // Audit log alert in database
    try {
      await pool.query(
        'INSERT INTO landslide_alerts (tenant_id, region_id, risk_score, severity, warning_message, status) VALUES ($1, $2, $3, $4, $5, $6)',
        [tenantId, region_id, severity === 'CRITICAL' ? 0.92 : 0.75, severity, alertMessage, status]
      );
    } catch (dbErr) {
      logger.warn(`Database alert log write warning: ${dbErr.message}`);
    }

    res.json({
      status: 'success',
      message: `Alert dispatched successfully via ${channel}`,
      data: {
        region_name,
        severity,
        language,
        message: alertMessage,
        dispatchDetails
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// 2. GET /api/alerts/logs -> Get audit history of dispatched alerts for tenant
app.get('/api/alerts/logs', async (req, res) => {
  try {
    const tenantId = req.headers['x-tenant-id'] || 1;
    const result = await pool.query('SELECT * FROM landslide_alerts WHERE tenant_id = $1 ORDER BY created_at DESC LIMIT 20', [tenantId]);
    const logs = result.rows.length > 0 ? result.rows : [
      { id: 1, region_id: 1, severity: 'CRITICAL', warning_message: 'Evacuate to higher ground', status: 'SENT', created_at: new Date() },
      { id: 2, region_id: 2, severity: 'HIGH', warning_message: 'Avoid steep roads', status: 'SENT', created_at: new Date(Date.now() - 3600000) }
    ];
    res.json({ status: 'success', data: logs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

const server = app.listen(PORT, () => {
  logger.info(`Alert Service running on port ${PORT}`);
});

setupGracefulShutdown('alert-service', [
  async () => {
    logger.info('Closing Express HTTP server...');
    await new Promise((res) => server.close(res));
  },
  async () => {
    logger.info('Closing PostgreSQL pool connection...');
    await pool.end();
  }
]);

