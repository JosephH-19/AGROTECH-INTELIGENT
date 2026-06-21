/**
 * Logger para métricas de desempeño.
 */
export class PerformanceLogger {
  static log(metric: string, value: number): void {
    console.info('[PerformanceLogger]', metric, value);
  }
}
