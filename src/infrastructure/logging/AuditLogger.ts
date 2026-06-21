/**
 * Logger para auditoría técnica.
 */
export class AuditLogger {
  static track(action: string, details?: unknown): void {
    console.info('[AuditLogger]', action, details ?? '');
  }
}
