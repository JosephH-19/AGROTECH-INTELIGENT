import { BaseDTO } from '@shared/types';

/**
 * DTO de aplicación para parcel data entre las capas.
 */
export interface ParcelDTO extends BaseDTO {
  name: string;
  latitude: number;
  longitude: number;
}
