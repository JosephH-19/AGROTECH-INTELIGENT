/**
 * Estrategia base para resolver conflictos de sincronización.
 */
export interface ConflictResolutionStrategy {
  resolve(local: unknown, remote: unknown): Promise<unknown>;
}
