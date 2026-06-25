export type UUID = string;

export interface BaseDTO {
  id: string;
  attribution: string;
  maxZoom: number;
  minZoom: number;
}
