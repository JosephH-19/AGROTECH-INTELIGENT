/**
 * Objeto de valor para direcciones de correo.
 * Validaciones básicas para mantener invariantes del dominio.
 */
export class Email {
  constructor(public readonly value: string) {
    if (!Email.isValid(value)) {
      throw new Error('Email inválido');
    }
  }

  static isValid(value: string): boolean {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  }
}
