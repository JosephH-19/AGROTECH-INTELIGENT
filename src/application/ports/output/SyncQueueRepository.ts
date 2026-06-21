import { SyncQueueItemDTO } from '@application/dto/SyncQueueItemDTO';

export interface SyncQueueRepository {
  enqueue(item: SyncQueueItemDTO): Promise<void>;
  dequeueNext(): Promise<SyncQueueItemDTO | null>;
  listPending(): Promise<SyncQueueItemDTO[]>;
}
