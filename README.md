# AgroTech Inteligente

Plataforma web para pequeños agricultores con monitoreo climático (NASA POWER), gestión de parcelas/cultivos, alertas inteligentes, y recomendaciones basadas en IA.

## Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS 3
- **Estado:** Zustand
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Clima:** NASA POWER API (SENAMHI bloqueado por CORS)
- **i18n:** i18next (Español, Quechua)
- **PWA:** vite-plugin-pwa

## Requisitos

- Node.js 18+
- npm

## Inicio rápido

```bash
cp .env.example .env   # editar con tus credenciales Supabase
npm install
npm run dev            # http://localhost:5173
```

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar producción |
| `npm run preview` | Preview de build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | TypeScript check |
| `npm test` | Vitest |
| `node setup.js` | Setup interactivo |

## Estructura

```
src/
├── adapters/       # Pages, componentes, API routes
├── application/    # DTOs, puertos, servicios, casos de uso
├── domain/         # Entidades, excepciones
├── infrastructure/ # Clima, persistencia, sync, seguridad
├── i18n/           # Traducciones
├── providers/      # Providers de React
├── shared/         # Store, tipos, helpers, constantes
└── styles/         # CSS global
```

## Supabase

Migraciones en `supabase/migrations/`. RLS implementado por rol (Agricultor, Cooperativa, ONG, Gobierno, Admin).

## APIs

- **NASA POWER** -- clima histórico (sin API key)
- **SENAMHI** -- bloqueado por CORS desde el browser (necesita proxy)
