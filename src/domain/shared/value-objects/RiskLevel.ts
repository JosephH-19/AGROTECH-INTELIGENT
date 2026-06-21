/**
 * Objeto de valor para el nivel de riesgo.
 */
export class RiskLevel {
  constructor(public readonly level: string) {
    if (!RiskLevel.isValid(level)) {
      throw new Error('RiskLevel inválido');
    }
  }

  static isValid(level: string): boolean {
    return ['low', 'medium', 'high', 'critical'].includes(level.toLowerCase());
  }
}
