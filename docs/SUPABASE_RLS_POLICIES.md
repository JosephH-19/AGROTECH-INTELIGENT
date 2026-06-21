# Supabase: Row Level Security (RLS) y Políticas para AgroTech

Este documento explica las políticas RLS básicas que hemos preparado y cómo aplicarlas a tu proyecto Supabase.

## Objetivo
Proteger los datos de los usuarios para que cada usuario solamente acceda y manipule sus propios recursos (parcelas, cultivos, alertas).

## Archivo SQL
Hemos añadido `database/migrations/0002_rls_and_policies.sql` que:
- Habilita RLS en `parcels`, `crops`, `alerts`, `users`.
- Crea políticas para que `auth.uid()` controle acceso.
- Deshabilita RLS en `sync_queue` y `audit_logs` (estos deben ser escritos por backend con claves de servicio).

## Políticas principales (resumen)
- Parcels: sólo el propietario (`owner_id`) puede ver o modificar.
- Crops: permitido solo si la `parcel_id` pertenece al usuario.
- Alerts: se permiten alerts asociadas a parcelas del usuario o alerts globales (parcel_id IS NULL).
- Users: cada usuario puede ver/actualizar su propio registro.

## Cómo aplicarlo
1. Abre tu proyecto en Supabase Dashboard
2. Ve a **SQL Editor** → **New query**
3. Pega el contenido de `database/migrations/0002_rls_and_policies.sql` y ejecútalo

## Notas de seguridad
- Asegúrate de tener RLS habilitado en las tablas donde se requiere control fino.
- No expongas `service_role` keys en el frontend. Úsalas solo en funciones de backend o en Cloud Functions.
- Para APIs públicas, habilita RLS y crea políticas específicas que permitan únicamente las operaciones necesarias.

## Ejemplo de verificación (consulta desde cliente)
```ts
import { supabase } from '@infrastructure/persistence/supabaseClient';

// Intentar obtener parcels del usuario autenticado
const { data, error } = await supabase.from('parcels').select('*');

// Si RLS está habilitado correctamente, recibirás solo las parcelas que pertenezcan al usuario autenticado.
```

Si deseas, puedo generar políticas adicionales más finas (por ejemplo: sólo permitir `INSERT` en `parcels` y no `DELETE` desde el cliente) o triggers que asignen `owner_id = auth.uid()` automáticamente en `INSERT`.
