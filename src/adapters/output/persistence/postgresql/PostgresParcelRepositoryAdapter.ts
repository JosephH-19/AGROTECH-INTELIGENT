import { Parcel } from '@domain/agricultural/entities/Parcel';
import { ParcelRepositoryPort } from '@application/ports/output/ParcelRepositoryPort';
import { httpClient } from '@infrastructure/http/HttpClient';

export class PostgresParcelRepositoryAdapter implements ParcelRepositoryPort {
  async findById(id: string): Promise<Parcel | null> {
    await httpClient.get(`/parcels/${id}`);
    return null;
  }

  async save(parcel: Parcel): Promise<void> {
    await httpClient.post('/parcels', parcel);
  }

  async listAll(): Promise<Parcel[]> {
    await httpClient.get('/parcels');
    return [];
  }
}
