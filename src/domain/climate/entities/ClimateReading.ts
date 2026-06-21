/**
 * Entidad de dominio para lecturas climáticas.
 * El dominio es independiente de la infraestructura.
 */
export class ClimateReading {
  constructor(public readonly id: string, public readonly temperature: number, public readonly humidity: number, public readonly recordedAt: Date) {
    if (!id) {
      throw new Error('ClimateReading debe tener un identificador válido');
    }
  }
}
