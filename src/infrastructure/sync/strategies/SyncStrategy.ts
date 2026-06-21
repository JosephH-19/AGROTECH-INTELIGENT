/**
 * Estrategia base para sincronización offline.
 */
export interface SyncStrategy {
  execute(): Promise<void>;
}
