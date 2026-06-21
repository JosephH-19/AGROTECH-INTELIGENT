import { Prediction } from '@domain/alerts/entities/Prediction';

export interface PredictionRepositoryPort {
  findById(id: string): Promise<Prediction | null>;
  listRecent(): Promise<Prediction[]>;
}
