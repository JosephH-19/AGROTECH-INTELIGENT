# Supabase setup for AgroTech

This document explains how to create a Supabase project, run the provided SQL migration, and connect the frontend using environment variables.

## 1) Create Supabase project
- Go to https://app.supabase.com and create a new project.
- Choose a secure database password and select a region near your users.
- Enable Data API if you want REST endpoints.

## 2) Environment variables
Copy `.env.example` to `.env` in project root and fill values:

```
VITE_API_URL=https://your-backend.example.com
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_XXXXXXXXXXXXXXXXXXXX
VITE_SUPABASE_ANON_KEY=your-anon-key
```

`VITE_SUPABASE_PUBLISHABLE_KEY` is typically the client key used by browsers. `VITE_SUPABASE_ANON_KEY` may be used as a fallback.

## 3) Run SQL migration
You can run `database/migrations/0001_initial_schema.sql` using one of the methods below.

### Option A — Supabase SQL editor (recommended)
1. Open your project in Supabase dashboard.
2. Go to **SQL Editor** → **New query**.
3. Copy the contents of `database/migrations/0001_initial_schema.sql` and run it.

### Option B — psql (local)
Run:

```bash
psql "postgresql://postgres:YOUR_PASSWORD@db.<your-project>.supabase.co:5432/postgres" -f database/migrations/0001_initial_schema.sql
```

### Option C — supabase CLI
Install supabase CLI and use the SQL Editor or `supabase db remote commit` workflows (see Supabase docs).

## 4) Install client library (local dev)
Ensure Node.js and npm are installed. On Windows you can install via the official installer: https://nodejs.org/

Then in your project root:

```bash
npm install
npm install @supabase/supabase-js
```

## 5) Frontend usage
We added a helper at `src/infrastructure/persistence/supabaseClient.ts`:

```ts
import { supabase } from '@infrastructure/persistence/supabaseClient';

const { data, error } = await supabase
  .from('parcels')
  .select('*')
  .limit(10);
```

## 6) Migrations & CI
For production workflows, consider using an ORM (Prisma, Drizzle) or storing SQL migrations under `database/migrations/` and running them from CI against your Supabase project.

## 7) Security
- Use Row Level Security (RLS) and policies in Supabase to control access.
- Do not store service role keys in the frontend; only server-side.

If you want, puedo generar políticas RLS básicas y scripts de ejemplo para usuarios y roles.
