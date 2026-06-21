export class Logger {
  static info(message: string, meta?: unknown): void {
    console.info('[AgroTech]', message, meta ?? '');
  }

  static warn(message: string, meta?: unknown): void {
    console.warn('[AgroTech]', message, meta ?? '');
  }

  static error(message: string, meta?: unknown): void {
    console.error('[AgroTech]', message, meta ?? '');
  }
}
