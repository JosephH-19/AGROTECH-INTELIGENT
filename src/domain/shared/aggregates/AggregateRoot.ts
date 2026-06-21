/**
 * Raíz de agregado genérica para el dominio.
 * Todos los agregados deben heredar de esta clase.
 */
export abstract class AggregateRoot {
  protected readonly domainEvents: Array<unknown> = [];

  protected addEvent(event: unknown): void {
    this.domainEvents.push(event);
  }

  getEvents(): Array<unknown> {
    return [...this.domainEvents];
  }
}
