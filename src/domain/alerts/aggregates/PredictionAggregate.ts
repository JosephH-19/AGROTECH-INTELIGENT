/**
 * Agregado raíz para predicciones de alertas.
 */
import { AggregateRoot } from '@domain/shared/aggregates/AggregateRoot';
import { Prediction } from '@domain/alerts/entities/Prediction';

export class PredictionAggregate extends AggregateRoot {
  constructor(public readonly root: Prediction) {
    super();
  }

  markAsProcessed(): void {
    this.addEvent({ eventName: 'PredictionProcessed', occurredOn: new Date(), payload: { predictionId: this.root.id } });
  }
}
