import axios from 'axios';
import { appConfig } from '@infrastructure/config/appConfig';

export const httpClient = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Placeholder para configuración del cliente HTTP.
// Se puede ampliar para manejar interceptores, autenticación y sincronización offline.
