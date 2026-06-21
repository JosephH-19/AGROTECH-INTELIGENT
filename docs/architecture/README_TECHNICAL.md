# README Técnico

Este documento resume la arquitectura base de Agrotech Inteligente.

## Objetivo

Construir una base profesional con:

- React + TypeScript + Vite
- Arquitectura Hexagonal + DDD + Clean Architecture
- Enfoque offline-first
- Preparación para sincronización SQLite / PostgreSQL

## Estructura clave

- `src/domain`: núcleo del modelo de dominio.
- `src/application`: casos de uso y puertos.
- `src/adapters`: interfaces de usuario y adaptadores de salida.
- `src/infrastructure`: soporte técnico y servicios de infraestructura.
- `src/shared`: utilidades y tipos compartidos.

## Cómo comenzar

1. Ejecutar `npm install`.
2. Ejecutar `npm run dev`.
3. Implementar nuevos casos de uso en `src/application/usecases`.
4. Agregar adaptadores de persistencia en `src/adapters/output`. 
