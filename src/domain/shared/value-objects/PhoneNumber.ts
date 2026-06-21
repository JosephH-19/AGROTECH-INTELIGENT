/**
 * Objeto de valor para números de teléfono.
 */
export class PhoneNumber {
  constructor(public readonly value: string) {
    if (!PhoneNumber.isValid(value)) {
      throw new Error('PhoneNumber inválido');
    }
  }

  static isValid(value: string): boolean {
    return /^\+?[0-9\s\-()]{7,20}$/.test(value);
  }
}
