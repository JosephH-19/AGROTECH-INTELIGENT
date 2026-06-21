import Dexie, { Table } from 'dexie';
import { ParcelDTO } from '@application/dto/ParcelDTO';
import { SyncQueueItemDTO } from '@application/dto/SyncQueueItemDTO';

export class OfflineDatabase extends Dexie {
  parcels!: Table<ParcelDTO, string>;
  syncQueue!: Table<SyncQueueItemDTO, string>;

  constructor() {
    super('AgrotechOfflineDB');
    this.version(1).stores({
      parcels: 'id,name,latitude,longitude',
      syncQueue: 'id,entityType,createdAt'
    });
  }
}
