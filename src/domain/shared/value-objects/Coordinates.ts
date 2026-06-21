export class Coordinates {
  constructor(public readonly latitude: number, public readonly longitude: number) {
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      throw new Error('Coordenadas inválidas para el objeto de valor Coordinates');
    }
  }
}
