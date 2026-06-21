/**
 * Handler de ejemplo para ilustrar la estructura de Event Driven Architecture.
 */
export class SampleEventHandler {
  handle(payload: unknown): void {
    // Placeholder: implement business reaction to eventos de dominio.
    console.log('SampleEventHandler received:', payload);
  }
}
