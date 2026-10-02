// Kafka Topic Definitions
export const KAFKA_TOPICS = {
  WEATHER_INGESTED: 'weather.ingested',
  RISK_EVALUATED: 'risk.evaluated',
  ROAD_STATUS_UPDATED: 'road.status.updated',
  FIELD_REPORT_SUBMITTED: 'field.report.submitted',
  FIELD_REPORT_VERIFIED: 'field.report.verified',
  ALERT_DISPATCHED: 'alert.dispatched',
};

// Risk Levels
export const RISK_LEVELS = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

// Road Statuses
export const ROAD_STATUS = {
  OPEN: 'OPEN',
  AT_RISK: 'AT_RISK',
  BLOCKED: 'BLOCKED',
};

// Report Statuses
export const REPORT_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  DISMISSED: 'DISMISSED',
};

// Notification Channels
export const ALERT_CHANNELS = {
  TELEGRAM: 'TELEGRAM',
  NTFY: 'NTFY',
  SMS: 'SMS',
};
