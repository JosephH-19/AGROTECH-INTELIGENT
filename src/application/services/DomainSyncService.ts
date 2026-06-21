import { SyncQueueRepository } from '@application/ports/output/SyncQueueRepository';

export class DomainSyncService {
  constructor(private readonly syncQueueRepository: SyncQueueRepository) {}

  async prepareSync(): Promise<void> {
    // Placeholder: preparar cola de sincronización offline sin lógica de negocio.
    await this.syncQueueRepository.listPending();
  }
}
