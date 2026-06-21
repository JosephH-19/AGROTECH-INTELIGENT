/**
 * Entidad de dominio que representa un cultivo dentro del contexto agrícola.
 * Solo contiene las invariantes básicas del dominio.
 */
export class Crop {
  constructor(public readonly id: string, public readonly name: string, public readonly variety: string) {
    if (!id) {
      throw new Error('Crop debe tener un identificador válido');
    }
  }
}
