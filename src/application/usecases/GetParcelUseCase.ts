import { Parcel } from '@domain/agricultural/entities/Parcel';
import { ParcelRepositoryPort } from '@application/ports/output/ParcelRepositoryPort';

export class GetParcelUseCase {
  constructor(private readonly parcelRepository: ParcelRepositoryPort) {}

  async execute(id: string): Promise<Parcel | null> {
    return this.parcelRepository.findById(id);
  }
}
