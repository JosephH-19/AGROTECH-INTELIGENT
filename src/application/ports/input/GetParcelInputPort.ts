import { Parcel } from '@domain/agricultural/entities/Parcel';

export interface GetParcelInputPort {
  execute(id: string): Promise<Parcel | null>;
}
