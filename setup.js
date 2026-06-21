#!/usr/bin/env node
// Setup script for AgroTech Inteligente — cross-platform (Linux, macOS, Windows)

import { execSync } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { resolve } from 'path';

const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
};

console.log('=== AgroTech Inteligente Setup ===\n');

// 1. Check Node.js
console.log(`Node.js: ${process.version}`);
console.log(`Platform: ${process.platform}\n`);

// 2. Copy .env if needed
const envPath = resolve('.env');
if (!existsSync(envPath)) {
  console.log('Creando .env desde .env.example...');
  copyFileSync('.env.example', '.env');
  console.log('EDITA .env con tus credenciales de Supabase antes de continuar.\n');
} else {
  console.log('.env ya existe.\n');
}

// 3. Install dependencies
if (!existsSync('node_modules')) {
  console.log('Instalando dependencias...');
  run('npm install');
} else {
  console.log('node_modules ya existe. Ejecuta npm install si necesitas actualizar.\n');
}

// 4. Instructions
console.log('\n=== Listo! ===');
console.log('\nComandos disponibles:');
console.log('  npm run dev        - Servidor de desarrollo (http://localhost:5173)');
console.log('  npm run build      - Compilar para produccion');
console.log('  npm run lint       - Verificar codigo');
console.log('  npm run typecheck  - Verificar tipos');
console.log('  npm test           - Ejecutar tests');
console.log('\nNo olvides ejecutar los scripts SQL en Supabase:');
console.log('  1. supabase/migrations/0001_full_schema.sql');
console.log('  2. supabase/fix_rls_recursion.sql');
console.log('  3. supabase/fix_rls_insert.sql');
console.log('  4. supabase/fix_register_rpc.sql');
console.log('  5. supabase/fix_password_hash.sql');
console.log('  (opcional) supabase/seed_test_data.sql');
