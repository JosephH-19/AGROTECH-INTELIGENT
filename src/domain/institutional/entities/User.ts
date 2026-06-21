/**
 * Entidad de dominio que representa un usuario en el sistema.
 */
export class User {
  constructor(public readonly id: string, public readonly name: string, public readonly email: string) {
    if (!id) {
      throw new Error('User debe tener un identificador válido');
    }
  }
}
