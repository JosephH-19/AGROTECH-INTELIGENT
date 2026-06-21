import { AggregateRoot } from '@domain/shared/aggregates/AggregateRoot';
import { Parcel } from '@domain/agricultural/entities/Parcel';

export class ParcelAggregate extends AggregateRoot {
  constructor(public readonly root: Parcel) {
    super();
  }

  addIncident(incidentId: string): void {
    // Placeholder: la lógica de agregado se implementará cuando el dominio esté definido.
    this.addEvent({ eventName: 'IncidentAdded', occurredOn: new Date(), payload: { incidentId } });
  }
}
