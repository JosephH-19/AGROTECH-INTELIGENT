/**
 * Entidad de dominio representando un incidente en campo.
 * Este archivo es un placeholder de dominio para el contexto agrícola.
 */
export class Incident {
  constructor(public readonly id: string, public readonly description: string, public readonly occurredAt: Date) {
    if (!id) {
      throw new Error('Incident debe tener un identificador válido');
    }
  }
}
