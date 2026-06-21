/**
 * Servicio base para operaciones JWT.
 * No implementa lógica de negocio, solo abstracción técnica.
 */
export class JwtService {
  sign(payload: unknown): string {
    return '';
  }

  verify(token: string): unknown {
    return null;
  }
}
