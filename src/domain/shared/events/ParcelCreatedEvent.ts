import { DomainEvent } from '@domain/events/DomainEvent';

export interface ParcelCreatedEvent extends DomainEvent {
  readonly parcelId: string;
}

export class DefaultParcelCreatedEvent implements ParcelCreatedEvent {
  readonly eventName = 'ParcelCreated';
  readonly occurredOn = new Date();

  constructor(public readonly parcelId: string) {}
}
