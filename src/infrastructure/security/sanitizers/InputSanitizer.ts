/**
 * Sanitizador básico para entradas de usuario.
 */
export class InputSanitizer {
  sanitize(value: string): string {
    return value.trim();
  }
}
