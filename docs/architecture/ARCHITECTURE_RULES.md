# Reglas Arquitectónicas de Agrotech Inteligente

## Principios clave

- **Hexagonal Architecture**: la aplicación está dividida en dominio, casos de uso, adaptadores e infraestructura.
- **DDD**: el dominio es el núcleo y no depende de la UI, infraestructura ni librerías externas.
- **Clean Architecture**: la dirección de dependencia va hacia el centro del dominio.
- **Offline-first**: todas las integraciones externas se desacoplan mediante adaptadores y hay soporte para cola de sincronización.

## Capas y dependencias permitidas

- `src/domain`: solo contiene entidades, agregados, objetos de valor, eventos y excepciones.
- `src/application`: contiene puertos, casos de uso, DTOs y servicios de aplicación. Solo depende de `domain`.
- `src/adapters`: contiene UI y adaptadores de salida. Implementa puertos sin contener lógica de negocio.
- `src/infrastructure`: contiene herramientas técnicas, logging, cache y DI. No contiene reglas de dominio.
- `src/shared`: utilidades genéricas, constantes, validaciones y tipos compartidos.

### Dependencias permitidas

- `domain` -> ninguna capa técnica.
- `application` -> `domain`.
- `adapters` -> `application`, `domain`, `infrastructure`, `shared`.
- `infrastructure` -> `shared`.
- `shared` -> ninguna capa de dominio ni infraestructura específica.

## Flujo hexagonal

1. `Page` / `Controller` en `adapters/input`
2. `Input Port` en `application/ports/input`
3. `Use Case` en `application/usecases`
4. `Output Port` en `application/ports/output`
5. `Repository Adapter` en `adapters/output`
6. `Persistence` / `API` en `infrastructure` o `adapters/output`
7. `Database` / `Servicio Externo`

## Principios DDD

- El dominio es el corazón de la solución.
- Las entidades son portadoras de identidad y reglas del dominio.
- Los objetos de valor expresan conceptos que no están definidos por identidad.
- Los agregados controlan la consistencia dentro de límites transaccionales.
- Los eventos de dominio representan sucesos significativos.
