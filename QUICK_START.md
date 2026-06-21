# 🚀 Guía Rápida: Instalar y Ejecutar AgroTech

## Requisitos previos

- **Node.js 18+** y **npm**
- **Navegador web moderno** (Chrome, Firefox, Safari, Edge)
- **Cuenta Supabase** (ya tienes una: `dyswhhsnnujfdbwjvtso`)

---

## Paso 1: Instalar Node.js (si no lo tienes)

### Opción A: Instalador oficial (Windows)
1. Ve a https://nodejs.org/
2. Descarga la versión LTS (recomendada)
3. Ejecuta el instalador y sigue los pasos
4. Reinicia tu terminal

### Opción B: Usar winget (si está disponible)
```powershell
winget install OpenJS.NodeJS
```

### Verificar instalación
```powershell
node --version
npm --version
```

---

## Paso 2: Clonar/Navegar al proyecto

```powershell
cd c:\Users\josep\Desktop\Agrotech-frontend
```

---

## Paso 3: Copiar variables de entorno

```powershell
# Copia .env.example a .env
copy .env.example .env
```

El archivo `.env` ya contiene tus credenciales de Supabase:
```
VITE_SUPABASE_URL=https://dyswhhsnnujfdbwjvtso.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_zAR3hbdrCRPRWRxbKY95hw_xfgWGW1J
```

---

## Paso 4: Instalar dependencias

```powershell
npm install
```

Esto instala:
- React, React Router, Zustand
- Tailwind CSS, PostCSS
- TypeScript, ESLint, Prettier
- Supabase.js
- Vite (bundler)
- Y más...

---

## Paso 5: Ejecutar migración SQL en Supabase

### Opción A: Desde el dashboard de Supabase (recomendado)
1. Ve a: https://supabase.com/dashboard/project/dyswhhsnnujfdbwjvtso/sql
2. Haz clic en **"New query"**
3. Copia el contenido de `database/migrations/0001_initial_schema.sql`
4. Pégalo en el editor SQL
5. Haz clic en **"Run"**

### Opción B: Desde terminal (con psql instalado)
```powershell
psql "postgresql://postgres:YOUR_DB_PASSWORD@db.dyswhhsnnujfdbwjvtso.supabase.co:5432/postgres" -f database/migrations/0001_initial_schema.sql
```

---

## Paso 6: Desarrollar localmente

Inicia el servidor de desarrollo:

```powershell
npm run dev
```

Verás algo como:
```
  VITE v5.4.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

Abre tu navegador en **http://localhost:5173/**

---

## Paso 7: Compilar para producción

Cuando estés listo para desplegar:

```powershell
npm run build
```

Esto crea una carpeta `dist/` con archivos optimizados listos para hosting.

---

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo |
| `npm run build` | Compilar para producción |
| `npm run preview` | Ver preview de compilación |
| `npm run lint` | Verificar código con ESLint |
| `npm run format` | Formatear código con Prettier |
| `npm run typecheck` | Verificar tipos TypeScript |
| `npm test` | Ejecutar tests (Vitest) |

---

## Solución de problemas

### Error: "ENOENT: no such file or directory"
Asegúrate de estar en la carpeta correcta:
```powershell
cd c:\Users\josep\Desktop\Agrotech-frontend
```

### Error: "Cannot find module '@supabase/supabase-js'"
Reinstala dependencias:
```powershell
npm install
npm install @supabase/supabase-js
```

### Error: "VITE_SUPABASE_URL is not set"
Verifica que tu archivo `.env` existe y contiene las variables correctas.

### Puerto 5173 ya en uso
Vite usará otro puerto automáticamente, o matá el proceso anterior:
```powershell
# En PowerShell, encuentra el proceso
Get-Process | Where-Object { $_.Handles -eq "*5173*" }
# Luego termínalo o cambia el puerto en vite.config.ts
```

---

## Próximos pasos

1. ✅ Instalar Node.js
2. ✅ Instalar dependencias (`npm install`)
3. ✅ Ejecutar migración SQL en Supabase
4. ✅ Iniciar desarrollo (`npm run dev`)
5. 📌 Configurar Row Level Security (RLS) en Supabase
6. 📌 Crear modelos de datos con adapters (ya hay ejemplo de Parcel)
7. 📌 Implementar autenticación con Supabase Auth

---

## Documentación adicional

- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

---

¿Necesitas ayuda? Revisa los logs en la terminal o contacta al equipo.
