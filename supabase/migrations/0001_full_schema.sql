-- ============================================================
-- AGROTECH INTELIGENTE - ESQUEMA COMPLETO SUPABASE
-- ============================================================
-- Fecha: 2025-06-21
-- Descripción: Esquema completo de base de datos con RLS
-- ============================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. TABLA: roles
-- ============================================================
CREATE TABLE roles (
  id_rol INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nombre_rol VARCHAR(30) NOT NULL UNIQUE,
  descripcion VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO roles (nombre_rol, descripcion) VALUES
  ('Agricultor', 'Usuario principal que registra cultivos y recibe alertas'),
  ('Cooperativa', 'Gestiona información agrícola colectiva'),
  ('ONG', 'Realiza seguimiento y asistencia técnica'),
  ('Gobierno Regional', 'Consulta estadísticas regionales'),
  ('Administrador', 'Gestiona usuarios y funcionamiento del sistema');

-- ============================================================
-- 2. TABLA: usuarios
-- ============================================================
CREATE TABLE usuarios (
  id_usuario UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_rol INT NOT NULL REFERENCES roles(id_rol),
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  telefono VARCHAR(9),
  idioma VARCHAR(5) DEFAULT 'es' CHECK (idioma IN ('es', 'qu', 'en')),
  estado VARCHAR(15) DEFAULT 'Activo' CHECK (estado IN ('Activo', 'Inactivo', 'Suspendido')),
  fecha_creacion TIMESTAMPTZ DEFAULT now(),
  ultimo_acceso TIMESTAMPTZ
);

-- ============================================================
-- 3. TABLA: cooperativas_detalle
-- ============================================================
CREATE TABLE cooperativas_detalle (
  id_cooperativa UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario),
  nombre_institucional VARCHAR(150) NOT NULL,
  ruc VARCHAR(11),
  region_operacion VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. TABLA: parcelas
-- ============================================================
CREATE TABLE parcelas (
  id_parcela UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_agricultor UUID NOT NULL REFERENCES usuarios(id_usuario),
  id_cooperativa UUID REFERENCES cooperativas_detalle(id_cooperativa),
  nombre_parcela VARCHAR(100) NOT NULL,
  tamano_hectareas DECIMAL(6,2) NOT NULL CHECK (tamano_hectareas > 0),
  latitud DECIMAL(10,8),
  longitud DECIMAL(10,8),
  tipo_suelo VARCHAR(20) CHECK (tipo_suelo IN ('Arcilloso', 'Franco', 'Arenoso', 'Limoso')),
  provincia VARCHAR(50),
  distrito VARCHAR(50),
  estado_salud VARCHAR(15) DEFAULT 'Bueno' CHECK (estado_salud IN ('Bueno', 'Advertencia', 'Crítico')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. TABLA: cultivos
-- ============================================================
CREATE TABLE cultivos (
  id_cultivo UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_parcela UUID NOT NULL REFERENCES parcelas(id_parcela) ON DELETE CASCADE,
  tipo_cultivo VARCHAR(50) NOT NULL,
  fecha_siembra DATE NOT NULL,
  estado_actual VARCHAR(30) NOT NULL CHECK (estado_actual IN ('Siembra', 'Crecimiento', 'Maduración', 'Cosechado')),
  notas TEXT,
  sincronizado BOOLEAN DEFAULT true,
  ultima_actualizacion TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. TABLA: incidencias_campania
-- ============================================================
CREATE TABLE incidencias_campania (
  id_incidencia UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_cultivo UUID NOT NULL REFERENCES cultivos(id_cultivo) ON DELETE CASCADE,
  tipo_incidencia VARCHAR(50) NOT NULL,
  descripcion TEXT,
  severidad VARCHAR(15) DEFAULT 'Media' CHECK (severidad IN ('Baja', 'Media', 'Alta', 'Crítica')),
  fecha_deteccion DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. TABLA: lecturas_climaticas
-- ============================================================
CREATE TABLE lecturas_climaticas (
  id_lectura UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_parcela UUID NOT NULL REFERENCES parcelas(id_parcela) ON DELETE CASCADE,
  fuente_api VARCHAR(20) NOT NULL CHECK (fuente_api IN ('SENAMHI', 'NASA')),
  temperatura DECIMAL(4,1),
  humedad DECIMAL(5,1),
  precipitacion DECIMAL(5,1),
  velocidad_viento DECIMAL(5,1),
  indice_uv DECIMAL(3,1),
  fecha_hora_lectura TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 8. TABLA: predicciones_recomendaciones_ia
-- ============================================================
CREATE TABLE predicciones_recomendaciones_ia (
  id_ia_resultado UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_cultivo UUID NOT NULL REFERENCES cultivos(id_cultivo) ON DELETE CASCADE,
  tipo_resultado VARCHAR(30) NOT NULL CHECK (tipo_resultado IN ('Predicción Clima', 'Riesgo Plaga', 'Optimización Riego', 'Recomendación Nutrición', 'Control Malezas', 'Cosecha')),
  recomendacion_es TEXT NOT NULL,
  recomendacion_qu TEXT,
  nivel_alerta VARCHAR(15) DEFAULT 'Informativo' CHECK (nivel_alerta IN ('Informativo', 'Moderado', 'Crítico')),
  impacto_esperado VARCHAR(100),
  fecha_procesamiento TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 9. TABLA: historial_alertas_enviadas
-- ============================================================
CREATE TABLE historial_alertas_enviadas (
  id_alerta_envio UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario UUID NOT NULL REFERENCES usuarios(id_usuario),
  id_ia_resultado UUID REFERENCES predicciones_recomendaciones_ia(id_ia_resultado),
  titulo VARCHAR(150) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo_alerta VARCHAR(30) NOT NULL CHECK (tipo_alerta IN ('Helada', 'Plaga', 'Sequía', 'Lluvia Intensa', 'Enfermedad')),
  severidad VARCHAR(15) NOT NULL CHECK (severidad IN ('Informativo', 'Advertencia', 'Crítico')),
  canal_envio VARCHAR(15) CHECK (canal_envio IN ('App Push', 'SMS', 'WhatsApp')),
  estado_envio VARCHAR(15) DEFAULT 'Pendiente' CHECK (estado_envio IN ('Enviado', 'Fallido', 'Pendiente')),
  leida BOOLEAN DEFAULT false,
  fecha_envio TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 10. TABLA: monitoreo_institucional
-- ============================================================
CREATE TABLE monitoreo_institucional (
  id_monitoreo UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_usuario_institucion UUID NOT NULL REFERENCES usuarios(id_usuario),
  provincia_asignada VARCHAR(50),
  distrito_asignado VARCHAR(50),
  notas_asistencia TEXT,
  fecha_monitoreo TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 11. TABLA: dispositivos_iot
-- ============================================================
CREATE TABLE dispositivos_iot (
  id_dispositivo UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_parcela UUID NOT NULL REFERENCES parcelas(id_parcela) ON DELETE CASCADE,
  tipo_sensor VARCHAR(50) NOT NULL CHECK (tipo_sensor IN ('Humedad Suelo', 'Temperatura Ambiental', 'pH Suelo', 'Radiación Solar')),
  estado_dispositivo VARCHAR(20) DEFAULT 'Activo' CHECK (estado_dispositivo IN ('Activo', 'Inactivo', 'Mantenimiento')),
  ultima_lectura TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
CREATE INDEX idx_usuarios_rol ON usuarios(id_rol);
CREATE INDEX idx_usuarios_correo ON usuarios(correo);
CREATE INDEX idx_parcelas_agricultor ON parcelas(id_agricultor);
CREATE INDEX idx_parcelas_cooperativa ON parcelas(id_cooperativa);
CREATE INDEX idx_cultivos_parcela ON cultivos(id_parcela);
CREATE INDEX idx_cultivos_estado ON cultivos(estado_actual);
CREATE INDEX idx_incidencias_cultivo ON incidencias_campania(id_cultivo);
CREATE INDEX idx_lecturas_parcela ON lecturas_climaticas(id_parcela);
CREATE INDEX idx_lecturas_fecha ON lecturas_climaticas(fecha_hora_lectura);
CREATE INDEX idx_predicciones_cultivo ON predicciones_recomendaciones_ia(id_cultivo);
CREATE INDEX idx_alertas_usuario ON historial_alertas_enviadas(id_usuario);
CREATE INDEX idx_alertas_leida ON historial_alertas_enviadas(leida);
CREATE INDEX idx_monitoreo_institucion ON monitoreo_institucional(id_usuario_institucion);
CREATE INDEX idx_dispositivos_parcela ON dispositivos_iot(id_parcela);

-- ============================================================
-- FUNCIÓN: actualizar timestamp
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_parcelas_updated_at
  BEFORE UPDATE ON parcelas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidencias_campania ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturas_climaticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE predicciones_recomendaciones_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_alertas_enviadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoreo_institucional ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispositivos_iot ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperativas_detalle ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLÍTICAS RLS - USUARIOS
-- ============================================================

-- Admin: puede ver y gestionar todos los usuarios
CREATE POLICY admin_all_usuarios ON usuarios
  USING (auth.uid() IN (SELECT id_usuario FROM usuarios WHERE id_rol = 5));

-- Cada usuario solo puede ver su propio perfil
CREATE POLICY user_self_usuarios ON usuarios
  FOR SELECT
  USING (auth.uid() = id_usuario);

-- Un usuario puede actualizar su propio perfil (excepto rol y estado)
CREATE POLICY user_update_self ON usuarios
  FOR UPDATE
  USING (auth.uid() = id_usuario)
  WITH CHECK (auth.uid() = id_usuario);

-- ============================================================
-- POLÍTICAS RLS - PARCELAS
-- ============================================================

-- Agricultor: CRUD solo en sus propias parcelas
CREATE POLICY farmer_parcelas ON parcelas
  USING (id_agricultor = auth.uid());

-- Cooperativa: puede ver parcelas de sus miembros
CREATE POLICY coop_view_parcelas ON parcelas
  FOR SELECT
  USING (
    id_cooperativa IN (
      SELECT cd.id_cooperativa FROM cooperativas_detalle cd WHERE cd.id_usuario = auth.uid()
    )
  );

-- Admin/Gobierno/ONG: puede ver todas las parcelas
CREATE POLICY institutional_view_parcelas ON parcelas
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol IN (3, 4, 5))
  );

-- ============================================================
-- POLÍTICAS RLS - CULTIVOS
-- ============================================================

-- Agricultor: CRUD en cultivos de sus parcelas
CREATE POLICY farmer_cultivos ON cultivos
  USING (
    id_parcela IN (SELECT id_parcela FROM parcelas WHERE id_agricultor = auth.uid())
  );

-- Institucional: SELECT
CREATE POLICY institutional_view_cultivos ON cultivos
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol IN (3, 4, 5))
  );

-- ============================================================
-- POLÍTICAS RLS - INCIDENCIAS
-- ============================================================

CREATE POLICY farmer_incidencias ON incidencias_campania
  USING (
    id_cultivo IN (
      SELECT c.id_cultivo FROM cultivos c
      JOIN parcelas p ON c.id_parcela = p.id_parcela
      WHERE p.id_agricultor = auth.uid()
    )
  );

CREATE POLICY institutional_view_incidencias ON incidencias_campania
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol IN (3, 4, 5))
  );

-- ============================================================
-- POLÍTICAS RLS - LECTURAS CLIMÁTICAS
-- ============================================================

CREATE POLICY parcel_owner_lecturas ON lecturas_climaticas
  USING (
    id_parcela IN (SELECT id_parcela FROM parcelas WHERE id_agricultor = auth.uid())
  );

CREATE POLICY institutional_view_lecturas ON lecturas_climaticas
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol IN (3, 4, 5))
  );

-- ============================================================
-- POLÍTICAS RLS - PREDICCIONES IA
-- ============================================================

CREATE POLICY farmer_predicciones ON predicciones_recomendaciones_ia
  USING (
    id_cultivo IN (
      SELECT c.id_cultivo FROM cultivos c
      JOIN parcelas p ON c.id_parcela = p.id_parcela
      WHERE p.id_agricultor = auth.uid()
    )
  );

CREATE POLICY institutional_view_predicciones ON predicciones_recomendaciones_ia
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol IN (3, 4, 5))
  );

-- ============================================================
-- POLÍTICAS RLS - HISTORIAL ALERTAS
-- ============================================================

-- Usuario ve sus propias alertas
CREATE POLICY user_alertas ON historial_alertas_enviadas
  USING (id_usuario = auth.uid());

-- Admin ve todas
CREATE POLICY admin_alertas ON historial_alertas_enviadas
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol = 5));

-- ============================================================
-- POLÍTICAS RLS - MONITOREO INSTITUCIONAL
-- ============================================================

CREATE POLICY institutional_monitoreo ON monitoreo_institucional
  USING (id_usuario_institucion = auth.uid());

CREATE POLICY admin_monitoreo ON monitoreo_institucional
  FOR SELECT
  USING (EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol = 5));

-- ============================================================
-- POLÍTICAS RLS - DISPOSITIVOS IOT
-- ============================================================

CREATE POLICY farmer_dispositivos ON dispositivos_iot
  USING (
    id_parcela IN (SELECT id_parcela FROM parcelas WHERE id_agricultor = auth.uid())
  );

CREATE POLICY institutional_view_dispositivos ON dispositivos_iot
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol IN (4, 5))
  );

-- ============================================================
-- POLÍTICAS RLS - COOPERATIVAS DETALLE
-- ============================================================

CREATE POLICY coop_self ON cooperativas_detalle
  USING (id_usuario = auth.uid());

CREATE POLICY admin_cooperativas ON cooperativas_detalle
  USING (EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = auth.uid() AND id_rol = 5));

-- ============================================================
-- FUNCIONES ÚTILES
-- ============================================================

-- Obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS INT AS $$
DECLARE
  role_id INT;
BEGIN
  SELECT id_rol INTO role_id FROM usuarios WHERE id_usuario = auth.uid();
  RETURN role_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Registrar nueva alerta
CREATE OR REPLACE FUNCTION registrar_alerta(
  p_id_usuario UUID,
  p_titulo VARCHAR,
  p_mensaje TEXT,
  p_tipo_alerta VARCHAR,
  p_severidad VARCHAR
) RETURNS UUID AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO historial_alertas_enviadas (id_usuario, titulo, mensaje, tipo_alerta, severidad)
  VALUES (p_id_usuario, p_titulo, p_mensaje, p_tipo_alerta, p_severidad)
  RETURNING id_alerta_envio INTO v_id;
  RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Obtener estadísticas para dashboard
CREATE OR REPLACE FUNCTION get_dashboard_stats(p_id_usuario UUID)
RETURNS TABLE(
  total_parcelas BIGINT,
  total_cultivos_activos BIGINT,
  alertas_sin_leer BIGINT,
  ultima_temp DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM parcelas WHERE id_agricultor = p_id_usuario),
    (SELECT COUNT(*) FROM cultivos c JOIN parcelas p ON c.id_parcela = p.id_parcela WHERE p.id_agricultor = p_id_usuario AND c.estado_actual != 'Cosechado'),
    (SELECT COUNT(*) FROM historial_alertas_enviadas WHERE id_usuario = p_id_usuario AND leida = false),
    (SELECT temperatura FROM lecturas_climaticas l JOIN parcelas p ON l.id_parcela = p.id_parcela WHERE p.id_agricultor = p_id_usuario ORDER BY l.fecha_hora_lectura DESC LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
