/**
 * Entidad de dominio para alertas generadas por el sistema.
 */
export class Alert {
  constructor(public readonly id: string, public readonly message: string, public readonly createdAt: Date) {
    if (!id) {
      throw new Error('Alert debe tener un identificador válido');
    }
  }
}
