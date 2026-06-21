import { SyncQueueItemDTO } from '@application/dto/SyncQueueItemDTO';
import { SyncQueueRepository } from '@application/ports/output/SyncQueueRepository';
import { OfflineDatabase } from '@infrastructure/cache/OfflineDatabase';

export class IndexedDBSyncQueueRepositoryAdapter implements SyncQueueRepository {
  constructor(private readonly database: OfflineDatabase) {}

  async enqueue(item: SyncQueueItemDTO): Promise<void> {
    // Placeholder: encolar elementos de sincronización offline.
  }

  async dequeueNext(): Promise<SyncQueueItemDTO | null> {
    return null;
  }

  async listPending(): Promise<SyncQueueItemDTO[]> {
    return [];
  }
}
