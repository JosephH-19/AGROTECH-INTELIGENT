/**
 * Entidad de dominio para predicciones relacionadas con alertas.
 */
export class Prediction {
  constructor(public readonly id: string, public readonly alertId: string, public readonly confidence: number) {
    if (!id) {
      throw new Error('Prediction debe tener un identificador válido');
    }
  }
}
