-- 0002_rls_and_policies.sql
-- Habilita Row Level Security (RLS) y crea políticas básicas para tablas principales.
-- Ejecuta este script desde el SQL editor de Supabase o con psql contra tu base de datos.

-- Nota: estas políticas asumen que los usuarios se autentican con Supabase Auth
-- y que `auth.uid()` devuelve el uuid del usuario actual.

-- Habilitar RLS en tablas públicas
ALTER TABLE IF EXISTS public.parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- PARCELS: solo el propietario puede seleccionar/insertar/actualizar/eliminar
CREATE POLICY IF NOT EXISTS "Parcels: owners can manage their parcels"
  ON public.parcels
  FOR ALL
  USING (owner_id = auth.uid()::uuid)
  WITH CHECK (owner_id = auth.uid()::uuid);

-- CROPS: sólo se pueden manipular cultivos de parcelas que pertenezcan al usuario
CREATE POLICY IF NOT EXISTS "Crops: owners can manage crops in their parcels"
  ON public.crops
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.parcels p WHERE p.id = public.crops.parcel_id AND p.owner_id = auth.uid()::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.parcels p WHERE p.id = public.crops.parcel_id AND p.owner_id = auth.uid()::uuid
    )
  );

-- ALERTS: propietarios de la parcela pueden ver/crear alertas relacionadas
CREATE POLICY IF NOT EXISTS "Alerts: parcel owners can manage alerts"
  ON public.alerts
  FOR ALL
  USING (
    public.alerts.parcel_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.parcels p WHERE p.id = public.alerts.parcel_id AND p.owner_id = auth.uid()::uuid
    )
  )
  WITH CHECK (
    public.alerts.parcel_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.parcels p WHERE p.id = public.alerts.parcel_id AND p.owner_id = auth.uid()::uuid
    )
  );

-- USERS: cada usuario puede ver y actualizar su propio registro (opcional)
CREATE POLICY IF NOT EXISTS "Users: users can view and update own profile"
  ON public.users
  FOR ALL
  USING (id = auth.uid()::uuid)
  WITH CHECK (id = auth.uid()::uuid);

-- SYNC_QUEUE: mantener privada; desactivar RLS (permite backend escribir con service role)
-- Si prefieres que clientes inserten, crea una política separada que controle la creación.
ALTER TABLE IF EXISTS public.sync_queue DISABLE ROW LEVEL SECURITY;

-- AUDIT_LOGS: solo el backend con service_role_key debe insertar registros (no exponer en el public API)
ALTER TABLE IF EXISTS public.audit_logs DISABLE ROW LEVEL SECURITY;

-- Recomendaciones:
-- 1) Ejecuta este script en el SQL editor de Supabase.
-- 2) Revisa las políticas y adáptalas a tu flujo de negocio.
-- 3) No publiques la service_role key en el frontend.

-- Fin de script
