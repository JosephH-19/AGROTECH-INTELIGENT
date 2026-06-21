import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Agrotech Inteligente',
        short_name: 'Agrotech',
        description: 'Plataforma inteligente agrícola con arquitectura offline-first.',
        theme_color: '#10B981',
        background_color: '#ffffff',
        display: 'standalone'
      }
    })
  ],
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@application': path.resolve(__dirname, 'src/application'),
      '@adapters': path.resolve(__dirname, 'src/adapters'),
      '@infrastructure': path.resolve(__dirname, 'src/infrastructure'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@styles': path.resolve(__dirname, 'src/styles')
    }
  },
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    cors: true,
    middlewareMode: false,
    hmr: {
      host: 'localhost',
      port: 5173
    }
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: false
  }
});
