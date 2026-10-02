# GeoShield AI - Comprehensive Architecture & Implementation Specification

This document details the exact technical specifications, database schemas, API routes, data flow models, and step-by-step instructions for building the **GeoShield AI** platform.

---

## 1. System Architecture Overview

GeoShield AI is an end-to-end AI-driven landslide and flood early-warning platform designed for the North Eastern Region (NER) of India.

```
+-----------------------------------------------------------------------------------+
|                                  DATA INGESTION                                   |
| (Open-Meteo API / IMD Weather / NASA GPM / ESA Sentinel Satellite / Sensor Feeds) |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
                      +------------------------------------+
                      | Ingestion Service (Node.js/Python) |
                      +------------------------------------+
                                         |
                                         v
                             +-----------------------+
                             | Apache Kafka Event Bus|
                             +-----------------------+
                                         |
                                         v
                      +------------------------------------+
                      | Risk Engine Service (Python/FastAPI|
                      |  LightGBM / PyTorch / GeoPandas)   |
                      +------------------------------------+
                                         |
                                         v
                    +------------------------------------------+
                    | Spatial Service & PostGIS Storage        |
                    | (PostgreSQL + PostGIS / Node.js Express) |
                    +------------------------------------------+
                      /                  |                   \
                     /                   v                    \
                    v          +--------------------+          v
    +-----------------------+  | Stream Service     |  +--------------------+
    | Alert Service         |  | (WebSocket Server) |  | Field Reports      |
    | (Telegram, ntfy, SMS) |  +--------------------+  | Service (Express)  |
    +-----------------------+            |             +--------------------+
               |                         |                       |
               v                         v                       v
    +-------------------+      +--------------------+  +--------------------+
    | Mobile PWA App    |      | Web GIS Dashboard  |  | Citizen / Agent    |
    | (Field/Citizens)  |      | (Next.js / React)  |  | Photo Verification |
    +-------------------+      +--------------------+  +--------------------+
```

---

## 2. Infrastructure & Environment Setup

### 2.1 Services & Ports Map
- **API Gateway**: `8000` (`http://localhost:8000`)
- **Ingestion Service**: `8001`
- **Spatial Service**: `8002`
- **Risk Engine Service**: `8003`
- **Alert Service**: `8004`
- **Field Reports Service**: `8005`
- **Stream Service (WebSocket)**: `8006`
- **PostgreSQL / PostGIS**: `5432`
- **Kafka**: `9092`
- **Redis**: `6379`
- **Web Frontend**: `3000`
- **Mobile PWA**: `8080` / `5173`

---

## 3. Database Schema Specification (PostGIS)

### 3.1 `regions` Table
```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    region_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    population INT DEFAULT 0,
    slope_deg NUMERIC(5,2) DEFAULT 0.0,
    soil_type VARCHAR(50),
    geom GEOMETRY(MultiPolygon, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_regions_geom ON regions USING GIST (geom);
```

### 3.2 `risk_events` Table
```sql
CREATE TABLE risk_events (
    id SERIAL PRIMARY KEY,
    region_id INT REFERENCES regions(id),
    risk_score NUMERIC(4,3) CHECK (risk_score BETWEEN 0 AND 1),
    risk_level VARCHAR(20) NOT NULL, -- LOW, MODERATE, HIGH, CRITICAL
    rainfall_24h_mm NUMERIC(6,2) DEFAULT 0.0,
    rainfall_7d_mm NUMERIC(6,2) DEFAULT 0.0,
    soil_moisture NUMERIC(4,3) DEFAULT 0.0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_risk_events_region_time ON risk_events(region_id, timestamp DESC);
```

### 3.3 `roads` Table
```sql
CREATE TABLE roads (
    id SERIAL PRIMARY KEY,
    road_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, AT_RISK, BLOCKED
    geom GEOMETRY(MultiLineString, 4326),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_roads_geom ON roads USING GIST (geom);
```

### 3.4 `field_reports` Table
```sql
CREATE TABLE field_reports (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    report_type VARCHAR(50) NOT NULL, -- LANDSLIDE, ROAD_BLOCK, FLOOD_WATER, CRACK
    description TEXT,
    photo_url VARCHAR(255),
    latitude NUMERIC(10,8) NOT NULL,
    longitude NUMERIC(11,8) NOT NULL,
    geom GEOMETRY(Point, 4326),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, VERIFIED, DISMISSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_field_reports_geom ON field_reports USING GIST (geom);
```

### 3.5 `alerts_log` Table
```sql
CREATE TABLE alerts_log (
    id SERIAL PRIMARY KEY,
    region_id INT REFERENCES regions(id),
    severity VARCHAR(20) NOT NULL,
    channel VARCHAR(30) NOT NULL, -- TELEGRAM, NTFY, SMS
    language VARCHAR(20) DEFAULT 'EN',
    recipient VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- SENT, FAILED
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. API Endpoints Contract

### 4.1 Ingestion Service
- `POST /api/ingestion/weather/trigger` -> Manually trigger Weather/Satellite API fetch.
- `GET /api/ingestion/forecast/:district` -> Fetch 7-day weather forecast.

### 4.2 Risk Engine Service
- `POST /api/risk/evaluate` -> Calculate risk scores given weather inputs & region features.
- `GET /api/risk/priority-list` -> Ranked priority directives sorted by risk & population.
- `GET /api/risk/analytics` -> Historical accuracy and landslide trends.

### 4.3 Spatial Service
- `GET /api/regions/geojson` -> GeoJSON layer of all regions with risk colors.
- `GET /api/regions/:id/detail` -> Region metadata + risk history.
- `GET /api/roads/status` -> Road status & isolated villages.

### 4.4 Alert Service
- `POST /api/alerts/dispatch` -> Dispatch emergency alert via Telegram/ntfy.
- `GET /api/alerts/history` -> Audit log of dispatched alerts.

### 4.5 Field Reports Service
- `POST /api/field-reports` -> Submit photo & geo-tagged report.
- `GET /api/field-reports?status=pending` -> Fetch field reports for verification.
- `PATCH /api/field-reports/:id/verify` -> Verify report and feed to risk model.

---

## 5. Web Dashboard Architecture (Next.js)

1. **GIS Dashboard (`pages/index.js`)**: Interactive MapLibre GL map with GeoJSON layer overlay, layer toggles, and live WebSocket updates.
2. **Region Detail Modal**: Shows rainfall trends, soil moisture charts, and satellite imagery pass date.
3. **Road Connectivity (`pages/roads.js`)**: Real-time road status grid + OSRM isolation prediction.
4. **Action Matrix (`pages/priority.js`)**: Auto-sorted priority mitigation list with one-click alert dispatch.
5. **Alert Log (`pages/alerts.js`)**: Dispatched alert audit history with filtering.
6. **Report Review (`pages/field-reports.js`)**: Verification module for citizen reports with location previews.
7. **Analytics (`pages/analytics.js`)**: Landslide vs rainfall correlation and ML accuracy trends.

---

## 6. Mobile PWA App Architecture (React/Vite PWA)

1. **Offline Store (IndexedDB)**: Caches nearby region risk and queues report submissions offline.
2. **Home Screen (`/home`)**: Current GPS risk level banner + offline indicator.
3. **Report Camera Screen (`/report`)**: Photo upload, auto GPS attachment, and offline queueing.
4. **Sync Center (`/sync`)**: Status of submitted and queued offline reports.
5. **Alert Feed (`/alerts`)**: Multilingual push notifications log.

---

## 7. Implementation Roadmap

1. **Step 1**: Ingest GIS boundary data for NER (Assam, Meghalaya, Sikkim, Nagaland, Mizoram, Manipur, Tripura, Arunachal Pradesh).
2. **Step 2**: Implement FastAPI ML risk engine with spatial feature weights.
3. **Step 3**: Launch Stream Service with WebSocket broadcasts.
4. **Step 4**: Complete Web GIS Dashboard & Mobile PWA offline sync pipeline.
