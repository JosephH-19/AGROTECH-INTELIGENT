/**
 * Entidad de dominio que representa un rol de usuario.
 */
export class Role {
  constructor(public readonly id: string, public readonly name: string) {
    if (!id) {
      throw new Error('Role debe tener un identificador válido');
    }
  }
}
