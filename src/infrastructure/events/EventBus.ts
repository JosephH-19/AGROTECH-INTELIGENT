/**
 * Event Bus ligero para transmitir eventos de dominio dentro de la aplicación.
 * Este archivo no contiene lógica de negocio, solo manejo de eventos.
 */
export class EventBus {
  private handlers = new Map<string, Array<(payload: unknown) => void>>();

  subscribe(eventName: string, handler: (payload: unknown) => void): void {
    const existing = this.handlers.get(eventName) ?? [];
    existing.push(handler);
    this.handlers.set(eventName, existing);
  }

  publish(eventName: string, payload: unknown): void {
    const handlers = this.handlers.get(eventName) ?? [];
    handlers.forEach((handler) => handler(payload));
  }
}
