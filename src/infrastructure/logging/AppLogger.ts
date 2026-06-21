/**
 * Logger principal de la aplicación.
 */
export class AppLogger {
  static info(message: string, meta?: unknown): void {
    console.info('[AppLogger]', message, meta ?? '');
  }

  static warn(message: string, meta?: unknown): void {
    console.warn('[AppLogger]', message, meta ?? '');
  }

  static error(message: string, meta?: unknown): void {
    console.error('[AppLogger]', message, meta ?? '');
  }
}
