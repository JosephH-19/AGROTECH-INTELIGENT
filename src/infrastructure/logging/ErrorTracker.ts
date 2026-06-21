/**
 * Error tracker técnico para registrar fallos.
 */
export class ErrorTracker {
  static capture(error: unknown): void {
    console.error('[ErrorTracker]', error);
  }
}
