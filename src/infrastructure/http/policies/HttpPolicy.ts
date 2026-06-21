/**
 * Política técnica de llamadas HTTP.
 */
export class HttpPolicy {
  getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json'
    };
  }
}
