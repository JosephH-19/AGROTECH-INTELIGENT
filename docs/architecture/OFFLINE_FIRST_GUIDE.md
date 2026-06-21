# Guía Offline-first

## Preparación existente

- `src/infrastructure/cache/OfflineDatabase.ts`: configuración base de IndexedDB con Dexie.
- `src/application/dto/SyncQueueItemDTO.ts`: DTO para items en cola de sincronización.
- `src/adapters/output/persistence/IndexedDBSyncQueueRepositoryAdapter.ts`: adaptador placeholder para cola offline.
- `src/infrastructure/sync/SQLitePostgresSyncService.ts`: servicio de sincronización desacoplado.
- `src/adapters/input/hooks/useNetworkStatus.ts`: hook de estado de red.

## Principios

1. El dominio nunca conoce de la base local.
2. Los casos de uso usan puertos de salida para almacenamiento.
3. Los adaptadores implementan persistencia offline.
4. La lógica de sincronización remota se prepara como servicio independiente.
