/**
 * Entidad de dominio para el nivel de riesgo climático calculado.
 */
export class ClimateRisk {
  constructor(public readonly id: string, public readonly riskLevel: string, public readonly assessedAt: Date) {
    if (!id) {
      throw new Error('ClimateRisk debe tener un identificador válido');
    }
  }
}
