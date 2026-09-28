-- NER-Connect | PostGIS schema (TDD section 4 data model)
-- Applied automatically by docker-compose (postgres/postgis image).
-- The prototype runs in-memory; this schema is the production target.

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ---------- users / RBAC ----------
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    phone         VARCHAR(16) UNIQUE,
    role          VARCHAR(16) NOT NULL DEFAULT 'citizen',  -- citizen|transporter|govt|admin
    language_pref VARCHAR(8)  NOT NULL DEFAULT 'en',
    district      VARCHAR(48),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- road network ----------
CREATE TABLE IF NOT EXISTS road_segments (
    id              VARCHAR(16) PRIMARY KEY,
    road            VARCHAR(12) NOT NULL,
    geometry        GEOGRAPHY(LINESTRING, 4326) NOT NULL,
    terrain_type    VARCHAR(24) NOT NULL,
    length_km       NUMERIC(7,2) NOT NULL,
    base_risk_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    last_updated    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_segments_geom ON road_segments USING GIST (geometry);

CREATE TABLE IF NOT EXISTS network_nodes (
    key       VARCHAR(16) PRIMARY KEY,
    name      VARCHAR(48) NOT NULL,
    state     VARCHAR(24) NOT NULL,
    geog      GEOGRAPHY(POINT, 4326) NOT NULL,
    is_hub    BOOLEAN NOT NULL DEFAULT FALSE
);

-- ---------- predictions ----------
CREATE TABLE IF NOT EXISTS predictions (
    id            BIGSERIAL PRIMARY KEY,
    segment_id    VARCHAR(16) REFERENCES road_segments(id),
    risk_score    NUMERIC(5,2) NOT NULL,
    confidence    NUMERIC(4,3),
    model_version VARCHAR(16) NOT NULL,
    generated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pred_segment ON predictions (segment_id, generated_at DESC);

-- ---------- crowdsourced reports ----------
CREATE TABLE IF NOT EXISTS disruption_reports (
    id          BIGSERIAL PRIMARY KEY,
    segment_id  VARCHAR(16) REFERENCES road_segments(id),
    reporter_id INTEGER REFERENCES users(id),
    type        VARCHAR(24) NOT NULL,   -- Landslide|Flood|Roadblock|BridgeDamage|Other
    severity    SMALLINT NOT NULL CHECK (severity BETWEEN 1 AND 5),
    photo_url   TEXT,
    note        TEXT,
    geog        GEOGRAPHY(POINT, 4326),
    verified    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reports_segment ON disruption_reports (segment_id, created_at DESC);

-- ---------- cargo shipments ----------
CREATE TABLE IF NOT EXISTS cargo_shipments (
    id          VARCHAR(16) PRIMARY KEY,        -- NER-0472
    type        VARCHAR(16) NOT NULL,           -- Medical|Food|Construction|General
    goods       TEXT,
    origin      VARCHAR(48) NOT NULL,
    destination VARCHAR(48) NOT NULL,
    route_id    VARCHAR(16),
    status      VARCHAR(16) NOT NULL,           -- IN TRANSIT|HELD|REROUTING|REROUTED|DELAYED|DELIVERED
    eta_ts      TIMESTAMPTZ,
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------- alerts ----------
CREATE TABLE IF NOT EXISTS alerts (
    id          BIGSERIAL PRIMARY KEY,
    segment_id  VARCHAR(16) REFERENCES road_segments(id),
    severity    VARCHAR(12) NOT NULL,           -- CRITICAL|WARNING|ADVISORY|INFO
    channel     VARCHAR(8)[] NOT NULL,          -- {PUSH,SMS,IVR}
    message     TEXT NOT NULL,
    recipients  INTEGER,
    sent_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    dedupe_key  TEXT UNIQUE                     -- alert deduplication (TDD 3.4)
);
