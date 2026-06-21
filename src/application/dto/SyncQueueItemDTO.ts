import { BaseDTO } from '@shared/types';

/**
 * DTO para la cola de sincronización offline.
 * Representa unidades de trabajo que se procesarán cuando haya conectividad.
 */
export interface SyncQueueItemDTO extends BaseDTO {
  entityType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
