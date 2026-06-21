import { Parcel } from '@domain/entities/Parcel';
import { ParcelDTO } from '@application/dto/ParcelDTO';
import { Coordinates } from '@domain/shared/value-objects/Coordinates';

export const mapParcelDtoToEntity = (dto: ParcelDTO): Parcel => {
  return new Parcel(dto.id, dto.name, new Coordinates(dto.latitude, dto.longitude));
};

export const mapParcelToDto = (parcel: Parcel): ParcelDTO => ({
  id: parcel.id,
  name: parcel.name,
  latitude: parcel.location.latitude,
  longitude: parcel.location.longitude
});
