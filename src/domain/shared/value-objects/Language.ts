/**
 * Objeto de valor para diferentes idiomas soportados.
 */
export class Language {
  constructor(public readonly code: string) {
    if (!Language.isValid(code)) {
      throw new Error('Language inválido');
    }
  }

  static isValid(code: string): boolean {
    return /^[a-z]{2}(-[A-Z]{2})?$/.test(code);
  }
}
