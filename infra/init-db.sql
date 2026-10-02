-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Tenants table
CREATE TABLE IF NOT EXISTS tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    tier VARCHAR(20) DEFAULT 'ENTERPRISE',
    rate_limit_per_min INT DEFAULT 1000,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) NOT NULL DEFAULT 'ANALYST', -- ADMIN, FIELD_OFFICER, ANALYST, OPERATOR, READ_ONLY
    permissions JSONB DEFAULT '[]',
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 3. Regions table
CREATE TABLE IF NOT EXISTS regions (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL,
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
CREATE INDEX IF NOT EXISTS idx_regions_geom ON regions USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_regions_district ON regions(district);
CREATE INDEX IF NOT EXISTS idx_regions_tenant ON regions(tenant_id);

-- 4. Risk Events & Forecast table
CREATE TABLE IF NOT EXISTS risk_events (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL,
    region_id INT REFERENCES regions(id) ON DELETE CASCADE,
    risk_score NUMERIC(4,3) CHECK (risk_score BETWEEN 0 AND 1),
    risk_level VARCHAR(20) NOT NULL, -- LOW, MODERATE, HIGH, CRITICAL
    rainfall_24h_mm NUMERIC(6,2) DEFAULT 0.0,
    rainfall_7d_mm NUMERIC(6,2) DEFAULT 0.0,
    soil_moisture NUMERIC(4,3) DEFAULT 0.0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_risk_events_region_time ON risk_events(region_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_risk_events_tenant ON risk_events(tenant_id);

-- 5. Roads table
CREATE TABLE IF NOT EXISTS roads (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL,
    road_name VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, AT_RISK, BLOCKED
    geom GEOMETRY(MultiLineString, 4326),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_roads_geom ON roads USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_roads_tenant ON roads(tenant_id);

-- 6. Field Reports table
CREATE TABLE IF NOT EXISTS field_reports (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL,
    user_id VARCHAR(50),
    reporter VARCHAR(100) DEFAULT 'Field Officer',
    report_type VARCHAR(50) NOT NULL, -- LANDSLIDE, ROAD_BLOCK, FLOOD_WATER, CRACK
    description TEXT,
    photo_url VARCHAR(255),
    latitude NUMERIC(10,8) NOT NULL,
    longitude NUMERIC(11,8) NOT NULL,
    geom GEOMETRY(Point, 4326),
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, VERIFIED, DISMISSED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_field_reports_geom ON field_reports USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_field_reports_tenant ON field_reports(tenant_id);

-- 7. Alerts Log table
CREATE TABLE IF NOT EXISTS alerts_log (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL,
    region_id INT REFERENCES regions(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- CRITICAL, WARNING, INFO
    channel VARCHAR(30) NOT NULL, -- TELEGRAM, NTFY, SMS, SIREN
    language VARCHAR(20) DEFAULT 'EN',
    recipient VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL, -- ACTIVE, ACKNOWLEDGED, RESOLVED
    geom GEOMETRY(Point, 4326),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_alerts_log_region_sent ON alerts_log(region_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_log_geom ON alerts_log USING GIST (geom);

-- 8. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    tenant_id INT REFERENCES tenants(id) ON DELETE SET NULL,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    resource_id VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_action ON audit_logs(tenant_id, action);

-- SEED DATA (Real Test Dataset)

-- Seed Tenant
INSERT INTO tenants (id, name, code, status, tier, rate_limit_per_min)
VALUES (1, 'National Disaster Command EOC', 'DEFAULT-GOV', 'ACTIVE', 'ENTERPRISE', 5000)
ON CONFLICT (code) DO NOTHING;

-- Seed Users with bcrypt hashes (Password: 'Operator@123')
-- bcrypt hash for 'Operator@123' is '$2a$10$wN9P35V/b.w/3g421tZqOu7tW4O54f3C0jE.i8oR3H9jU5YmO62kO'
INSERT INTO users (id, tenant_id, email, password_hash, full_name, role, phone)
VALUES 
(1, 1, 'alok.verma@geoshield.gov.in', '$2a$10$wN9P35V/b.w/3g421tZqOu7tW4O54f3C0jE.i8oR3H9jU5YmO62kO', 'Dr. Alok Verma', 'ADMIN', '+919876543210'),
(2, 1, 's.rawat@sikkim.police.gov.in', '$2a$10$wN9P35V/b.w/3g421tZqOu7tW4O54f3C0jE.i8oR3H9jU5YmO62kO', 'Inspector Suresh Rawat', 'FIELD_OFFICER', '+919876543211'),
(3, 1, 'm.joshi@nhai.gov.in', '$2a$10$wN9P35V/b.w/3g421tZqOu7tW4O54f3C0jE.i8oR3H9jU5YmO62kO', 'Meenakshi Joshi', 'OPERATOR', '+919876543212'),
(4, 1, 't.norbu@hydro.met.gov.in', '$2a$10$wN9P35V/b.w/3g421tZqOu7tW4O54f3C0jE.i8oR3H9jU5YmO62kO', 'Tenzing Norbu', 'ANALYST', '+919876543213'),
(5, 1, 'liaison@sdrf.gov.in', '$2a$10$wN9P35V/b.w/3g421tZqOu7tW4O54f3C0jE.i8oR3H9jU5YmO62kO', 'Agency Liaison Officer', 'READ_ONLY', '+919876543214')
ON CONFLICT (email) DO NOTHING;

-- Seed 5 Monitored Sectors with Real PostGIS MultiPolygons
INSERT INTO regions (id, tenant_id, region_code, name, district, state, population, slope_deg, soil_type, geom)
VALUES
(1, 1, 'SK-NORTH-04', 'Northern Sikkim (Sector 4)', 'Mangan', 'Sikkim', 42800, 38.5, 'Weathered Schist', ST_Multi(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[88.45,27.45],[88.65,27.45],[88.65,27.65],[88.45,27.65],[88.45,27.45]]]}'))),
(2, 1, 'SK-WEST-09', 'Western Ridge (Pass 9)', 'Gyalshing', 'Sikkim', 18400, 44.2, 'Colluvial Gravel', ST_Multi(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[88.15,27.20],[88.35,27.20],[88.35,27.40],[88.15,27.40],[88.15,27.20]]]}'))),
(3, 1, 'SK-EAST-02', 'Eastern Valley (Lowlands)', 'Pakyong', 'Sikkim', 112000, 22.0, 'Alluvial Silt', ST_Multi(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[88.55,27.15],[88.75,27.15],[88.75,27.35],[88.55,27.35],[88.55,27.15]]]}'))),
(4, 1, 'ML-SO-01', 'Cherrapunji Catchment', 'East Khasi Hills', 'Meghalaya', 14829, 39.0, 'Limestone Karst', ST_Multi(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[91.70,25.20],[91.85,25.20],[91.85,25.35],[91.70,25.35],[91.70,25.20]]]}'))),
(5, 1, 'AS-KAM-02', 'Guwahati Hills (Kamrup)', 'Kamrup Metro', 'Assam', 957352, 24.5, 'Red Clay Soil', ST_Multi(ST_GeomFromGeoJSON('{"type":"Polygon","coordinates":[[[91.70,26.10],[91.85,26.10],[91.85,26.25],[91.70,26.25],[91.70,26.10]]]}')))
ON CONFLICT (region_code) DO NOTHING;

-- Seed Roads with Real PostGIS MultiLineStrings
INSERT INTO roads (id, tenant_id, road_name, district, status, geom)
VALUES
(1, 1, 'NH-10 Sector 4 Arterial', 'Mangan', 'BLOCKED', ST_Multi(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[88.50,27.48],[88.55,27.53],[88.60,27.58]]}'))),
(2, 1, 'Pass 9 Mountain Route', 'Gyalshing', 'AT_RISK', ST_Multi(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[88.18,27.24],[88.22,27.28],[88.26,27.32]]}'))),
(3, 1, 'State Highway 3B Valley Bypass', 'Pakyong', 'OPEN', ST_Multi(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[88.58,27.28],[88.62,27.32],[88.66,27.36]]}'))),
(4, 1, 'NH-06 Shillong-Silchar Highway', 'East Khasi Hills', 'AT_RISK', ST_Multi(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[91.72,25.22],[91.78,25.28],[91.83,25.32]]}'))),
(5, 1, 'NH-27 Guwahati Corridor', 'Kamrup Metro', 'OPEN', ST_Multi(ST_GeomFromGeoJSON('{"type":"LineString","coordinates":[[91.71,26.12],[91.77,26.18],[91.84,26.22]]}')))
ON CONFLICT (id) DO NOTHING;

-- Seed Real Alerts with PostGIS Points
INSERT INTO alerts_log (id, tenant_id, region_id, title, severity, channel, recipient, status, geom)
VALUES
(1, 1, 1, 'Critical Flash Flood Warning: Teesta River Basin', 'CRITICAL', 'SIREN', 'SDRF Command Grid', 'ACTIVE', ST_GeomFromGeoJSON('{"type":"Point","coordinates":[88.55,27.53]}')),
(2, 1, 2, 'Active Debris Flow on Western Ridge Pass', 'CRITICAL', 'TELEGRAM', 'NHAI Emergency Team', 'ACTIVE', ST_GeomFromGeoJSON('{"type":"Point","coordinates":[88.22,27.28]}')),
(3, 1, 3, 'Culvert Silt Blockage & Water Logging Hazard', 'WARNING', 'SMS', 'Municipal Crew', 'ACKNOWLEDGED', ST_GeomFromGeoJSON('{"type":"Point","coordinates":[88.62,27.32]}'))
ON CONFLICT (id) DO NOTHING;

-- Seed Real Field Reports
INSERT INTO field_reports (id, tenant_id, user_id, reporter, report_type, description, latitude, longitude, geom, status)
VALUES
(1, 1, '2', 'Inspector Suresh Rawat', 'ROAD_BLOCK', 'Culvert blocked with heavy boulders. Water overtopping road.', 27.3200, 88.6200, ST_GeomFromGeoJSON('{"type":"Point","coordinates":[88.62,27.32]}'), 'VERIFIED'),
(2, 1, '2', 'Officer T. Lepcha', 'LANDSLIDE', '40mm tension crack along upper slope embankment.', 27.2800, 88.2200, ST_GeomFromGeoJSON('{"type":"Point","coordinates":[88.22,27.28]}'), 'PENDING')
ON CONFLICT (id) DO NOTHING;
