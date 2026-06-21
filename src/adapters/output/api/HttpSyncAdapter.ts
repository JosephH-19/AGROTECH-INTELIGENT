import { SyncQueueItemDTO } from '@application/dto/SyncQueueItemDTO';

export class HttpSyncAdapter {
  async pushQueueItem(item: SyncQueueItemDTO): Promise<void> {
    // Placeholder: API externa para sincronización remota.
  }
}
