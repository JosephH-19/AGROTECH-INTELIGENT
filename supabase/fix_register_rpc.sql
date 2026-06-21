-- ============================================================
-- FUNCIÓN: crear perfil de usuario (bypass RLS)
-- ============================================================
-- El INSERT directo desde el frontend falla porque la sesión
-- de auth no está disponible para RLS en ese momento.
-- Esta función SECURITY DEFINER puede insertar sin RLS.
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_id_usuario UUID,
  p_nombres VARCHAR,
  p_apellidos VARCHAR,
  p_correo VARCHAR,
  p_telefono VARCHAR,
  p_id_rol INT,
  p_idioma VARCHAR DEFAULT 'es'
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.usuarios (id_usuario, nombres, apellidos, correo, telefono, id_rol, idioma)
  VALUES (p_id_usuario, p_nombres, p_apellidos, p_correo, p_telefono, p_id_rol, p_idioma);
END;
$$;

-- Otorgar permiso de ejecución al rol anónimo (necesario para el frontend)
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
