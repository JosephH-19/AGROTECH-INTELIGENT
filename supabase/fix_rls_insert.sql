-- ============================================================
-- FIX: Agregar WITH CHECK para INSERTs en tablas
-- ============================================================

-- USUARIOS: el usuario se inserta a sí mismo durante registro
CREATE POLICY user_insert_usuarios ON usuarios
  FOR INSERT
  WITH CHECK (id_usuario = auth.uid());

-- PARCELAS
CREATE POLICY farmer_parcelas_insert ON parcelas
  FOR INSERT
  WITH CHECK (id_agricultor = auth.uid());

-- CULTIVOS
CREATE POLICY farmer_cultivos_insert ON cultivos
  FOR INSERT
  WITH CHECK (
    id_parcela IN (SELECT id_parcela FROM parcelas WHERE id_agricultor = auth.uid())
  );

-- LECTURAS CLIMÁTICAS
CREATE POLICY parcel_owner_lecturas_insert ON lecturas_climaticas
  FOR INSERT
  WITH CHECK (
    id_parcela IN (SELECT id_parcela FROM parcelas WHERE id_agricultor = auth.uid())
  );

-- HISTORIAL ALERTAS
CREATE POLICY user_alertas_insert ON historial_alertas_enviadas
  FOR INSERT
  WITH CHECK (id_usuario = auth.uid());

-- INCIDENCIAS
CREATE POLICY farmer_incidencias_insert ON incidencias_campania
  FOR INSERT
  WITH CHECK (
    id_cultivo IN (
      SELECT c.id_cultivo FROM cultivos c
      JOIN parcelas p ON c.id_parcela = p.id_parcela
      WHERE p.id_agricultor = auth.uid()
    )
  );

-- PREDICCIONES IA
CREATE POLICY farmer_predicciones_insert ON predicciones_recomendaciones_ia
  FOR INSERT
  WITH CHECK (
    id_cultivo IN (
      SELECT c.id_cultivo FROM cultivos c
      JOIN parcelas p ON c.id_parcela = p.id_parcela
      WHERE p.id_agricultor = auth.uid()
    )
  );

-- DISPOSITIVOS IOT
CREATE POLICY farmer_dispositivos_insert ON dispositivos_iot
  FOR INSERT
  WITH CHECK (
    id_parcela IN (SELECT id_parcela FROM parcelas WHERE id_agricultor = auth.uid())
  );

-- COOPERATIVAS DETALLE
CREATE POLICY coop_self_insert ON cooperativas_detalle
  FOR INSERT
  WITH CHECK (id_usuario = auth.uid());
