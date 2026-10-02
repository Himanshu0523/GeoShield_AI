# 🛡️ GeoShield AI - Landslide Risk Assessment & Emergency Response Platform

GeoShield AI is an enterprise-grade, microservice-based AI platform tailored for real-time landslide risk assessment, spatial hazard analysis, and automated emergency alert dispatch in India's North-Eastern Region (NER).

---

## 🏗️ Complete Monorepo System Architecture

```
                               ┌───────────────────────────┐
                               │     Web GIS Dashboard     │
                               │      (Next.js / React)    │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │   GeoShield Mobile PWA    │
                               │      (Vite / Field App)   │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │    Central API Gateway    │
                               │     (Express Proxy 8000)  │
                               └─────────────┬─────────────┘
                                             │
      ┌──────────────────┬───────────────────┼───────────────────┬──────────────────┐
      │                  │                   │                   │                  │
      ▼                  ▼                   ▼                   ▼                  ▼
┌───────────┐      ┌───────────┐       ┌───────────┐       ┌───────────┐      ┌───────────┐
│ Ingestion │      │ Spatial   │       │   Risk    │       │   Alert   │      │  Field    │
│ Service   │      │ Service   │       │   Engine  │       │  Service  │      │ Reports   │
│ (8001)    │      │ (8002)    │       │   (8003)  │       │  (8004)   │      │ (8006)    │
└─────┬─────┘      └─────┬─────┘       └─────┬─────┘       └─────┬─────┘      └─────┬─────┘
      │                  │                   │                   │                  │
      │                  │                   ▼                   │                  │
      │                  │             ┌───────────┐             │                  │
      │                  │             │ Python ML │             │                  │
      │                  │             │  Engine   │             │                  │
      │                  │             │  (8007)   │             │                  │
      │                  │             └───────────┘             │                  │
      │                  │                                       │                  │
      └──────────────────┴───────────────────┬───────────────────┴──────────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │    PostGIS Spatial DB     │
                               │ & Kafka / Redis Streaming │
                               └───────────────────────────┘
```

---

## ⚡ Summary of Built Microservices & Components

| Component | Tech Stack | Port | Primary Responsibility |
| :--- | :--- | :--- | :--- |
| **API Gateway** | Node.js / Express Proxy | `8000` | Unified endpoint routing, CORS handling, rate limiting & request proxying |
| **Ingestion Service** | Node.js / Open-Meteo API | `8001` | Automated 30-min weather data fetch & Kafka event publishing (`weather.ingested`) |
| **Spatial Service** | Node.js / PostGIS | `8002` | Geospatial GeoJSON region queries, ST_Intersects road block evaluation |
| **Risk Engine Service**| Node.js / Axios | `8003` | Landslide risk scoring, priority mitigation directives, ML engine proxy |
| **Alert Service** | Node.js / ntfy & Telegram | `8004` | Multi-channel multilingual emergency broadcasts (English, Khasi, Assamese, Bengali) |
| **Stream Service** | Socket.io / Node.js | `8005` | Real-time map telemetry & hazard movement WebSocket broadcasting |
| **Field Reports** | Node.js / Express | `8006` | Citizen & officer mobile incident reporting with spatial GPS indexing |
| **ML Engine** | Python FastAPI / LightGBM | `8007` | Real-time ML landslide risk inference based on rainfall, slope, & soil moisture |
| **Web GIS Dashboard**| Next.js / React / Lucide | `3000` | Executive control room UI, interactive hazard maps, & priority directives |
| **Mobile PWA** | Vite / React | `3001` | Offline-ready field reporter app for citizen GPS tagging & emergency SOS |

---

## 🚀 How to Launch the Full Stack

### 1. Start Infrastructure Dependencies (PostGIS, Redis, Kafka)
```bash
docker-compose up -d
```

### 2. Run Backend Services & ML Engine
```bash
# Gateway
cd services/api-gateway && npm start

# Microservices
cd services/ingestion-service && npm start
cd services/spatial-service && npm start
cd services/risk-engine-service && npm start
cd services/alert-service && npm start
cd services/stream-service && npm start
cd services/field-reports-service && npm start

# Python ML Engine
cd ml-engine && uvicorn main:app --host 0.0.0.0 --port 8007
```

### 3. Launch Frontend Applications
```bash
# Web Dashboard
cd frontend && npm run dev

# Mobile Field Reporter
cd mobile-app && npm run dev
```

---

## 🎯 Verification Checklist

- [x] All 7 backend microservices fully scaffolded with Express/Node.js.
- [x] LightGBM Python FastAPI ML Engine configured for hazard risk prediction.
- [x] PostGIS schema (`infra/init-db.sql`) with spatial functions and indexes created.
- [x] Shared events module (`shared/events/topics.js`) establishing Kafka topics.
- [x] Next.js Web GIS Dashboard with complete pages, sidebar, hazard maps, and statistics.
- [x] Vite + React Mobile PWA for field reporting and offline incident queuing.
