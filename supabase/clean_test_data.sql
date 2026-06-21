-- ============================================================
-- CLEANUP: Eliminar datos de prueba (mantiene usuarios)
-- ============================================================
-- Elimina parcelas, cultivos, lecturas, alertas, etc.
-- pero NO elimina la tabla usuarios ni sus registros.
-- ============================================================

-- Desactivar RLS temporalmente para la limpieza
ALTER TABLE dispositivos_iot DISABLE ROW LEVEL SECURITY;
ALTER TABLE historial_alertas_enviadas DISABLE ROW LEVEL SECURITY;
ALTER TABLE predicciones_recomendaciones_ia DISABLE ROW LEVEL SECURITY;
ALTER TABLE lecturas_climaticas DISABLE ROW LEVEL SECURITY;
ALTER TABLE incidencias_campania DISABLE ROW LEVEL SECURITY;
ALTER TABLE cultivos DISABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas DISABLE ROW LEVEL SECURITY;
ALTER TABLE monitoreo_institucional DISABLE ROW LEVEL SECURITY;
ALTER TABLE cooperativas_detalle DISABLE ROW LEVEL SECURITY;

-- Eliminar datos (orden respetando FK)
DELETE FROM dispositivos_iot;
DELETE FROM monitoreo_institucional;
DELETE FROM historial_alertas_enviadas;
DELETE FROM predicciones_recomendaciones_ia;
DELETE FROM lecturas_climaticas;
DELETE FROM incidencias_campania;
DELETE FROM cultivos;
DELETE FROM parcelas;
DELETE FROM cooperativas_detalle;

-- Reactivar RLS
ALTER TABLE dispositivos_iot ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_alertas_enviadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE predicciones_recomendaciones_ia ENABLE ROW LEVEL SECURITY;
ALTER TABLE lecturas_climaticas ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidencias_campania ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcelas ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoreo_institucional ENABLE ROW LEVEL SECURITY;
ALTER TABLE cooperativas_detalle ENABLE ROW LEVEL SECURITY;

RAISE NOTICE 'Datos de prueba eliminados. Usuarios intactos.';
