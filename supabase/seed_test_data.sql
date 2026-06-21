-- ============================================================
-- SEED: Datos de prueba completos para AgroTech Inteligente
-- ============================================================
-- Inserta parcelas, cultivos, incidencias, lecturas climáticas,
-- alertas, predicciones IA, dispositivos IoT y monitoreo.
--
-- Los datos se asignan al primer usuario registrado.
-- Los administradores ven todo gracias a las políticas RLS.
-- ============================================================

DO $$
DECLARE
  v_user_id UUID;
  v_parcela1 UUID;
  v_parcela2 UUID;
  v_parcela3 UUID;
  v_cultivo1 UUID;
  v_cultivo2 UUID;
  v_cultivo3 UUID;
  v_cultivo4 UUID;
  v_cultivo5 UUID;
  v_fecha DATE;
  v_i INT;
BEGIN
  SELECT id_usuario INTO v_user_id FROM public.usuarios ORDER BY fecha_creacion ASC LIMIT 1;
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'No hay usuarios. Registra uno primero.';
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM public.parcelas WHERE id_agricultor = v_user_id) THEN
    RAISE NOTICE 'El usuario ya tiene datos. Seed omitido.';
    RETURN;
  END IF;

  -- ==========================================================
  -- PARCELAS (5)
  -- ==========================================================
  INSERT INTO public.parcelas (id_agricultor, nombre_parcela, tamano_hectareas, tipo_suelo, provincia, distrito, latitud, longitud, estado_salud)
  VALUES (v_user_id, 'Parcela San Juan', 2.5, 'Franco', 'Huancayo', 'Chilca', -12.0833, -75.2167, 'Bueno')
  RETURNING id_parcela INTO v_parcela1;

  INSERT INTO public.parcelas (id_agricultor, nombre_parcela, tamano_hectareas, tipo_suelo, provincia, distrito, latitud, longitud, estado_salud)
  VALUES (v_user_id, 'Parcela Los Olivos', 1.8, 'Arcilloso', 'Chupaca', 'Huamancaca', -12.0525, -75.2853, 'Advertencia')
  RETURNING id_parcela INTO v_parcela2;

  INSERT INTO public.parcelas (id_agricultor, nombre_parcela, tamano_hectareas, tipo_suelo, provincia, distrito, latitud, longitud, estado_salud)
  VALUES (v_user_id, 'Parcela El Retiro', 3.2, 'Arenoso', 'Tarma', 'Acobamba', -11.2075, -75.6844, 'Bueno')
  RETURNING id_parcela INTO v_parcela3;

  INSERT INTO public.parcelas (id_agricultor, nombre_parcela, tamano_hectareas, tipo_suelo, provincia, distrito, latitud, longitud, estado_salud)
  VALUES (v_user_id, 'Parcela La Esperanza', 4.0, 'Limoso', 'Jauja', 'Apata', -11.7833, -75.5000, 'Bueno');

  INSERT INTO public.parcelas (id_agricultor, nombre_parcela, tamano_hectareas, tipo_suelo, provincia, distrito, latitud, longitud, estado_salud)
  VALUES (v_user_id, 'Parcela Santa Rosa', 1.2, 'Franco', 'Concepción', 'Heroínas Toledo', -11.9167, -75.3167, 'Crítico');

  -- ==========================================================
  -- CULTIVOS (8)
  -- ==========================================================
  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela1, 'Papa', CURRENT_DATE - INTERVAL '60 days', 'Crecimiento')
  RETURNING id_cultivo INTO v_cultivo1;

  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela1, 'Maíz', CURRENT_DATE - INTERVAL '15 days', 'Siembra')
  RETURNING id_cultivo INTO v_cultivo2;

  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela2, 'Quinua', CURRENT_DATE - INTERVAL '120 days', 'Maduración')
  RETURNING id_cultivo INTO v_cultivo3;

  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela2, 'Cebada', CURRENT_DATE - INTERVAL '210 days', 'Cosechado')
  RETURNING id_cultivo INTO v_cultivo4;

  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela3, 'Frijol', CURRENT_DATE - INTERVAL '45 days', 'Crecimiento')
  RETURNING id_cultivo INTO v_cultivo5;

  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela3, 'Avena', CURRENT_DATE - INTERVAL '90 days', 'Maduración');

  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela1, 'Maca', CURRENT_DATE - INTERVAL '180 days', 'Cosechado');

  INSERT INTO public.cultivos (id_parcela, tipo_cultivo, fecha_siembra, estado_actual)
  VALUES (v_parcela2, 'Café', CURRENT_DATE - INTERVAL '30 days', 'Siembra');

  -- ==========================================================
  -- INCIDENCIAS DE CAMPAÑA (5)
  -- ==========================================================
  INSERT INTO public.incidencias_campania (id_cultivo, tipo_incidencia, descripcion, severidad, fecha_deteccion)
  VALUES (v_cultivo1, 'Plaga', 'Detección temprana de gorgojo de los Andes en el surco 12.', 'Alta', CURRENT_DATE - INTERVAL '5 days');

  INSERT INTO public.incidencias_campania (id_cultivo, tipo_incidencia, descripcion, severidad, fecha_deteccion)
  VALUES (v_cultivo2, 'Maleza', 'Crecimiento excesivo de maleza en bordes del cultivo.', 'Media', CURRENT_DATE - INTERVAL '3 days');

  INSERT INTO public.incidencias_campania (id_cultivo, tipo_incidencia, descripcion, severidad, fecha_deteccion)
  VALUES (v_cultivo3, 'Sequía', 'Estrés hídrico leve detectado en sector oeste.', 'Baja', CURRENT_DATE - INTERVAL '7 days');

  INSERT INTO public.incidencias_campania (id_cultivo, tipo_incidencia, descripcion, severidad, fecha_deteccion)
  VALUES (v_cultivo4, 'Plaga', 'Presencia de pulgón en hojas inferiores, 5% del área afectada.', 'Media', CURRENT_DATE - INTERVAL '2 days');

  INSERT INTO public.incidencias_campania (id_cultivo, tipo_incidencia, descripcion, severidad, fecha_deteccion)
  VALUES (v_cultivo5, 'Enfermedad', 'Manchas foliares detectadas en variedad de frijol Canario.', 'Alta', CURRENT_DATE);

  -- ==========================================================
  -- LECTURAS CLIMÁTICAS (últimos 7 días para parcela1)
  -- ==========================================================
  FOR v_i IN 0..6 LOOP
    v_fecha := CURRENT_DATE - (6 - v_i) * INTERVAL '1 day';
    INSERT INTO public.lecturas_climaticas (id_parcela, fuente_api, temperatura, humedad, precipitacion, velocidad_viento, indice_uv, fecha_hora_lectura)
    VALUES (
      v_parcela1,
      'NASA',
      14.5 + random() * 6,
      60 + random() * 20,
      random() * 8,
      8 + random() * 10,
      4 + random() * 5,
      v_fecha + TIME '08:00:00'
    );
  END LOOP;

  -- Lecturas para parcela2 y parcela3
  INSERT INTO public.lecturas_climaticas (id_parcela, fuente_api, temperatura, humedad, precipitacion, velocidad_viento, indice_uv, fecha_hora_lectura)
  VALUES (v_parcela2, 'NASA', 20.0, 55, 0.5, 8.0, 8.0, CURRENT_DATE - INTERVAL '1 day');

  INSERT INTO public.lecturas_climaticas (id_parcela, fuente_api, temperatura, humedad, precipitacion, velocidad_viento, indice_uv, fecha_hora_lectura)
  VALUES (v_parcela3, 'NASA', 22.0, 40, 0.0, 12.0, 9.0, CURRENT_DATE - INTERVAL '2 days');

  -- ==========================================================
  -- PREDICCIONES Y RECOMENDACIONES IA (6)
  -- ==========================================================
  INSERT INTO public.predicciones_recomendaciones_ia (id_cultivo, tipo_resultado, recomendacion_es, nivel_alerta, impacto_esperado)
  VALUES (v_cultivo1, 'Riesgo Plaga', 'Aplicar control biológico con Bacillus thuringiensis en los próximos 3 días para prevenir propagación del gorgojo.', 'Crítico', 'Reduce pérdida de cosecha en un 40%');

  INSERT INTO public.predicciones_recomendaciones_ia (id_cultivo, tipo_resultado, recomendacion_es, nivel_alerta, impacto_esperado)
  VALUES (v_cultivo2, 'Optimización Riego', 'Reducir riego a 3 veces por semana. Humedad del suelo al 75% es suficiente para la etapa actual.', 'Informativo', 'Ahorro de agua del 25% sin afectar rendimiento');

  INSERT INTO public.predicciones_recomendaciones_ia (id_cultivo, tipo_resultado, recomendacion_es, nivel_alerta, impacto_esperado)
  VALUES (v_cultivo3, 'Recomendación Nutrición', 'Aplicar fertilizante NPK 10-30-10 en dosis de 150 kg/ha para promover floración.', 'Moderado', 'Incremento de rendimiento estimado en 20%');

  INSERT INTO public.predicciones_recomendaciones_ia (id_cultivo, tipo_resultado, recomendacion_es, nivel_alerta, impacto_esperado)
  VALUES (v_cultivo1, 'Predicción Clima', 'Se esperan temperaturas mínimas de 6°C en los próximos días. Cubrir cultivos con malla antihelada.', 'Moderado', 'Protege el 95% del cultivo ante heladas');

  INSERT INTO public.predicciones_recomendaciones_ia (id_cultivo, tipo_resultado, recomendacion_es, nivel_alerta, impacto_esperado)
  VALUES (v_cultivo4, 'Control Malezas', 'Realizar deshierbo manual selectivo en bordes del cultivo. Evitar herbicidas cerca del café.', 'Informativo', 'Mejora la aireación y reduce competencia por nutrientes');

  INSERT INTO public.predicciones_recomendaciones_ia (id_cultivo, tipo_resultado, recomendacion_es, nivel_alerta, impacto_esperado)
  VALUES (v_cultivo5, 'Cosecha', 'El cultivo de frijol alcanzará punto óptimo de cosecha en 10-12 días. Preparar herramientas y personal.', 'Moderado', 'Cosecha en ventana óptima maximiza calidad del grano');

  -- ==========================================================
  -- ALERTAS ENVIADAS (7)
  -- ==========================================================
  INSERT INTO public.historial_alertas_enviadas (id_usuario, id_ia_resultado, titulo, mensaje, tipo_alerta, severidad, estado_envio, leida, fecha_envio)
  SELECT v_user_id, id_ia_resultado,
    'Riesgo de helada nocturna',
    'Se pronostican temperaturas bajo 6°C para las próximas 48 horas en Huancayo. Protege tus cultivos de papa y maíz con cobertura.',
    'Helada', 'Crítico', 'Enviado', false, CURRENT_DATE - INTERVAL '1 day'
  FROM public.predicciones_recomendaciones_ia WHERE tipo_resultado = 'Predicción Clima' LIMIT 1;

  INSERT INTO public.historial_alertas_enviadas (id_usuario, titulo, mensaje, tipo_alerta, severidad, estado_envio, leida, fecha_envio)
  VALUES (v_user_id, 'Detección de plagas en parcelas', 'Se ha detectado riesgo de gorgojo de los Andes en el sector San Juan. Acción recomendada: aplicar Bacillus thuringiensis.', 'Plaga', 'Advertencia', 'Enviado', false, CURRENT_DATE - INTERVAL '2 days');

  INSERT INTO public.historial_alertas_enviadas (id_usuario, titulo, mensaje, tipo_alerta, severidad, estado_envio, leida, fecha_envio)
  VALUES (v_user_id, 'Sequía moderada en Tarma', 'Niveles de precipitación por debajo del promedio histórico. Considera implementar riego por goteo en parcela El Retiro.', 'Sequía', 'Advertencia', 'Enviado', true, CURRENT_DATE - INTERVAL '5 days');

  INSERT INTO public.historial_alertas_enviadas (id_usuario, titulo, mensaje, tipo_alerta, severidad, estado_envio, leida, fecha_envio)
  VALUES (v_user_id, 'Lluvias intensas esperadas', 'Senamhi pronostica lluvias fuertes (>15mm) para el fin de semana en la región Junín. Verifica drenajes y canales.', 'Lluvia Intensa', 'Informativo', 'Enviado', true, CURRENT_DATE - INTERVAL '3 days');

  INSERT INTO public.historial_alertas_enviadas (id_usuario, titulo, mensaje, tipo_alerta, severidad, estado_envio, leida, fecha_envio)
  VALUES (v_user_id, 'Alerta fitosanitaria - Gorgojo', 'Reporte de agricultores vecinos confirma presencia de gorgojo de los Andes. Inspeccionar cultivos de papa ASAP.', 'Plaga', 'Crítico', 'Enviado', false, CURRENT_DATE - INTERVAL '6 hours');

  INSERT INTO public.historial_alertas_enviadas (id_usuario, titulo, mensaje, tipo_alerta, severidad, estado_envio, leida, fecha_envio)
  VALUES (v_user_id, 'Recomendación de abonamiento', 'Análisis de suelo indica deficiencia de fósforo. Aplicar fertilizante NPK 10-30-10 en parcelas de maíz y quinua.', 'Enfermedad', 'Informativo', 'Pendiente', false, CURRENT_DATE);

  INSERT INTO public.historial_alertas_enviadas (id_usuario, titulo, mensaje, tipo_alerta, severidad, estado_envio, leida, fecha_envio)
  VALUES (v_user_id, 'Condiciones óptimas para siembra', 'La ventana climática para siembra de quinua está abierta. Temperatura y humedad del suelo en rangos ideales.', 'Enfermedad', 'Informativo', 'Pendiente', true, CURRENT_DATE - INTERVAL '4 days');

  -- ==========================================================
  -- DISPOSITIVOS IOT (4)
  -- ==========================================================
  INSERT INTO public.dispositivos_iot (id_parcela, tipo_sensor, estado_dispositivo, ultima_lectura)
  VALUES (v_parcela1, 'Humedad Suelo', 'Activo', CURRENT_DATE - INTERVAL '2 hours');

  INSERT INTO public.dispositivos_iot (id_parcela, tipo_sensor, estado_dispositivo, ultima_lectura)
  VALUES (v_parcela1, 'Temperatura Ambiental', 'Activo', CURRENT_DATE - INTERVAL '30 minutes');

  INSERT INTO public.dispositivos_iot (id_parcela, tipo_sensor, estado_dispositivo, ultima_lectura)
  VALUES (v_parcela2, 'Humedad Suelo', 'Activo', CURRENT_DATE - INTERVAL '1 day');

  INSERT INTO public.dispositivos_iot (id_parcela, tipo_sensor, estado_dispositivo, ultima_lectura)
  VALUES (v_parcela3, 'pH Suelo', 'Mantenimiento', CURRENT_DATE - INTERVAL '7 days');

  -- ==========================================================
  -- MONITOREO INSTITUCIONAL (2 registros)
  -- ==========================================================
  INSERT INTO public.monitoreo_institucional (id_usuario_institucion, provincia_asignada, distrito_asignado, notas_asistencia)
  VALUES (v_user_id, 'Huancayo', 'Chilca', 'Visita técnica realizada. Cultivos de papa en buen estado. Se recomendó control preventivo de plagas.');

  INSERT INTO public.monitoreo_institucional (id_usuario_institucion, provincia_asignada, distrito_asignado, notas_asistencia)
  VALUES (v_user_id, 'Tarma', 'Acobamba', 'Monitoreo de cultivos de quinua. Se identificó déficit hídrico. Coordinar riego complementario.');

  RAISE NOTICE 'Datos de prueba insertados correctamente para el usuario %.', v_user_id;
END $$;
