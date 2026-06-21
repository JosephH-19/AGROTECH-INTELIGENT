import { Parcel } from '@domain/agricultural/entities/Parcel';
import { ParcelRepositoryPort } from '@application/ports/output/ParcelRepositoryPort';
import { OfflineDatabase } from '@infrastructure/cache/OfflineDatabase';

export class IndexedDBParcelRepositoryAdapter implements ParcelRepositoryPort {
  constructor(private readonly database: OfflineDatabase) {}

  async findById(id: string): Promise<Parcel | null> {
    // Implementación adaptadora pendiente: transformar datos de IndexedDB a entidad de dominio.
    return null;
  }

  async save(parcel: Parcel): Promise<void> {
    // Implementación adaptadora pendiente: persistir entidad en IndexedDB.
  }

  async listAll(): Promise<Parcel[]> {
    // Implementación adaptadora pendiente: leer todas las parcelas de IndexedDB.
    return [];
  }
}
