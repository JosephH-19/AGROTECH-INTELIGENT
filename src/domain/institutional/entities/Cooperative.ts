/**
 * Entidad de dominio para cooperativas e instituciones.
 */
export class Cooperative {
  constructor(public readonly id: string, public readonly name: string, public readonly country: string) {
    if (!id) {
      throw new Error('Cooperative debe tener un identificador válido');
    }
  }
}
