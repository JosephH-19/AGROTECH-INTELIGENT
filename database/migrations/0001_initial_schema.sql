-- 0001_initial_schema.sql
-- Migración inicial para AgroTech (Supabase/Postgres)

-- Extensiones recomendadas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Usuarios (autenticación externa recomendada: usar Auth de Supabase)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Parcelas
CREATE TABLE IF NOT EXISTS parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  area_m2 numeric,
  soil_type text,
  latitude numeric,
  longitude numeric,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Cultivos en parcelas
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id uuid NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  crop_type text NOT NULL,
  variety text,
  planted_at date,
  expected_harvest date,
  status text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Alertas (climáticas, plagas, recomendaciones)
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id uuid REFERENCES parcels(id) ON DELETE SET NULL,
  alert_type text NOT NULL,
  severity text NOT NULL,
  message text NOT NULL,
  data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  acknowledged boolean NOT NULL DEFAULT false
);

-- Cola de sincronización offline
CREATE TABLE IF NOT EXISTS sync_queue (
  id bigserial PRIMARY KEY,
  entity text NOT NULL,
  entity_id uuid,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Auditoría básica
CREATE TABLE IF NOT EXISTS audit_logs (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity text,
  entity_id uuid,
  changes jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_parcels_owner ON parcels(owner_id);
CREATE INDEX IF NOT EXISTS idx_crops_parcel ON crops(parcel_id);
CREATE INDEX IF NOT EXISTS idx_alerts_parcel ON alerts(parcel_id);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);

-- Datos de ejemplo (opcional)
-- INSERT INTO users(email, full_name) VALUES ('demo@example.com', 'Demo User');

-- Fin de migración
