/**
 * Enrutador de eventos para registros y procesamiento adicional.
 */
import { EventBus } from './EventBus';

export class EventDispatcher {
  constructor(private readonly eventBus: EventBus) {}

  dispatch(eventName: string, payload: unknown): void {
    this.eventBus.publish(eventName, payload);
  }
}
