export class Logger {
  static info(message: string, context?: unknown): void {
    console.info('[Agrotech]', message, context ?? '');
  }

  static warn(message: string, context?: unknown): void {
    console.warn('[Agrotech]', message, context ?? '');
  }

  static error(message: string, context?: unknown): void {
    console.error('[Agrotech]', message, context ?? '');
  }
}
