type Factory<T> = () => T;

interface Registration<T> {
  factory: Factory<T>;
  singleton: boolean;
  instance?: T;
}

const registry = new Map<symbol, Registration<unknown>>();

export const register = <T>(key: symbol, factory: Factory<T>, singleton = true): void => {
  registry.set(key, { factory, singleton });
};

export const resolve = <T>(key: symbol): T => {
  const registration = registry.get(key);
  if (!registration) {
    throw new Error(`Dependency not registered for key: ${key.toString()}`);
  }

  if (registration.singleton) {
    registration.instance ??= registration.factory();
    return registration.instance as T;
  }

  return registration.factory();
};

export const clearContainer = (): void => {
  registry.clear();
};

export const initializeContainer = (): void => {
  // Inicialización del contenedor DI.
  // Actualmente no hay registros automáticos necesarios,
  // pero esta función garantiza que la importación en main.tsx compile correctamente.
};
