-- ============================================================
-- FIX: Recursión infinita en políticas RLS
-- ============================================================
-- El problema: las políticas que hacen subconsultas a la tabla
-- "usuarios" disparan RLS sobre sí mismas, causando recursión.
-- La solución: función SECURITY DEFINER que bypasses RLS.
-- ============================================================

-- 1. Función helper que obtiene el rol sin disparar RLS
CREATE OR REPLACE FUNCTION public.get_user_role_id()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  role_id INT;
BEGIN
  SELECT id_rol INTO role_id FROM public.usuarios WHERE id_usuario = auth.uid();
  RETURN role_id;
END;
$$;

-- 2. Eliminar políticas problemáticas
DROP POLICY IF EXISTS admin_all_usuarios ON usuarios;
DROP POLICY IF EXISTS institutional_view_parcelas ON parcelas;
DROP POLICY IF EXISTS institutional_view_cultivos ON cultivos;
DROP POLICY IF EXISTS institutional_view_incidencias ON incidencias_campania;
DROP POLICY IF EXISTS institutional_view_lecturas ON lecturas_climaticas;
DROP POLICY IF EXISTS institutional_view_predicciones ON predicciones_recomendaciones_ia;
DROP POLICY IF EXISTS admin_alertas ON historial_alertas_enviadas;
DROP POLICY IF EXISTS admin_monitoreo ON monitoreo_institucional;
DROP POLICY IF EXISTS institutional_view_dispositivos ON dispositivos_iot;
DROP POLICY IF EXISTS admin_cooperativas ON cooperativas_detalle;

-- 3. Recrear políticas usando la función SECURITY DEFINER

-- USUARIOS
CREATE POLICY admin_all_usuarios ON usuarios
  USING (public.get_user_role_id() = 5);

-- PARCELAS
CREATE POLICY institutional_view_parcelas ON parcelas
  FOR SELECT
  USING (public.get_user_role_id() IN (3, 4, 5));

-- CULTIVOS
CREATE POLICY institutional_view_cultivos ON cultivos
  FOR SELECT
  USING (public.get_user_role_id() IN (3, 4, 5));

-- INCIDENCIAS
CREATE POLICY institutional_view_incidencias ON incidencias_campania
  FOR SELECT
  USING (public.get_user_role_id() IN (3, 4, 5));

-- LECTURAS CLIMÁTICAS
CREATE POLICY institutional_view_lecturas ON lecturas_climaticas
  FOR SELECT
  USING (public.get_user_role_id() IN (3, 4, 5));

-- PREDICCIONES IA
CREATE POLICY institutional_view_predicciones ON predicciones_recomendaciones_ia
  FOR SELECT
  USING (public.get_user_role_id() IN (3, 4, 5));

-- HISTORIAL ALERTAS
CREATE POLICY admin_alertas ON historial_alertas_enviadas
  FOR SELECT
  USING (public.get_user_role_id() = 5);

-- MONITOREO INSTITUCIONAL
CREATE POLICY admin_monitoreo ON monitoreo_institucional
  FOR SELECT
  USING (public.get_user_role_id() = 5);

-- DISPOSITIVOS IOT
CREATE POLICY institutional_view_dispositivos ON dispositivos_iot
  FOR SELECT
  USING (public.get_user_role_id() IN (4, 5));

-- COOPERATIVAS DETALLE
CREATE POLICY admin_cooperativas ON cooperativas_detalle
  USING (public.get_user_role_id() = 5);

-- 4. Actualizar funciones existentes para usar SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS INT AS $$
BEGIN
  RETURN public.get_user_role_id();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
