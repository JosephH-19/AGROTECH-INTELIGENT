# Guia rapida: Instalar y ejecutar AgroTech

## Requisitos

- Node.js 18+ y npm
- Navegador moderno
- Cuenta Supabase

## Pasos

```bash
# 1. Clonar o navegar al proyecto
cd Agrotech-frontend

# 2. Copiar variables de entorno y editarlas
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 3. Instalar dependencias
npm install

# 4. Ejecutar migracion SQL en Supabase
# Ir a https://supabase.com/dashboard/project/tu-proyecto/sql
# Copiar y ejecutar: supabase/migrations/0001_full_schema.sql
# Luego ejecutar los fixes en orden:
#   supabase/fix_rls_recursion.sql
#   supabase/fix_rls_insert.sql
#   supabase/fix_register_rpc.sql
#   supabase/fix_password_hash.sql

# 5. Iniciar desarrollo
npm run dev
# Abrir http://localhost:5173

# 6. Compilar para produccion
npm run build
```

## Comandos utiles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilar produccion |
| `npm run preview` | Preview de build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | TypeScript check |
| `npm test` | Vitest |
