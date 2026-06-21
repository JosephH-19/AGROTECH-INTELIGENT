import { Parcel } from '@domain/agricultural/entities/Parcel';

export interface ParcelRepositoryPort {
  findById(id: string): Promise<Parcel | null>;
  save(parcel: Parcel): Promise<void>;
  listAll(): Promise<Parcel[]>;
}
