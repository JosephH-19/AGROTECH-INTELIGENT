/**
 * Interceptor técnico para peticiones HTTP.
 */
import { AxiosRequestConfig } from 'axios';

export const requestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return config;
};
