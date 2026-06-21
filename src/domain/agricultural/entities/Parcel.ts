import { Coordinates } from '@domain/shared/value-objects/Coordinates';

/**
 * Entidad de dominio que representa una parcela agrícola.
 * Esta clase solo contiene reglas simples de invariantes del dominio.
 */
export class Parcel {
  constructor(public readonly id: string, public readonly name: string, public readonly location: Coordinates) {
    if (!id) {
      throw new Error('Parcel debe tener un identificador válido');
    }
  }
}
