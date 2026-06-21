/**
 * Publicador de eventos de dominio.
 * Desacopla la generación de eventos de su entrega.
 */
import { EventBus } from './EventBus';

export class DomainEventPublisher {
  constructor(private readonly eventBus: EventBus) {}

  publish(eventName: string, payload: unknown): void {
    this.eventBus.publish(eventName, payload);
  }
}
