import { SyncQueueRepository } from '@application/ports/output/SyncQueueRepository';

export class SyncDataUseCase {
  constructor(private readonly syncQueueRepository: SyncQueueRepository) {}

  async execute(): Promise<void> {
    // Placeholder: use case de sincronización offline-first.
    await this.syncQueueRepository.listPending();
  }
}
