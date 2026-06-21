# 🌱 AgroTech - Reingeniería Vanilla JavaScript

## Descripción

**AgroTech** es una plataforma inteligente de monitoreo agrícola transformada completamente a **Vanilla JavaScript (ES6+)**, **HTML5 semántico** y **CSS moderno**. 

La aplicación no requiere ningún framework externo y se ejecuta directamente en el navegador. Está diseñada específicamente para entornos rurales agrícolas de América Latina (con soporte para Español y Quechua).

---

## ✨ Características Principales

### 📊 Dashboard
- Banner de bienvenida personalizado
- Tarjetas con contadores dinámicos (Parcelas, Cultivos, Alertas)
- Mini pronóstico de 7 días
- Carrusel de recomendaciones IA

### 🌾 Gestión de Parcelas
- Grid interactivo de parcelas
- Indicadores visuales de salud
- Formulario modal para agregar nuevas parcelas
- Campos: Nombre, Área, Tipo de Suelo, Fuente de Agua

### 🌤️ Monitoreo de Clima
- Panel de condiciones actuales (Temperatura, Humedad, Lluvia, Viento, Índice UV, Presión)
- Pronóstico de 7 días con iconografía
- Tabs para datos SENAMHI y NASA POWER

### ⚠️ Alertas Agrícolas
- Lista filtrable por severidad (Crítica/Advertencia/Información)
- Botones para marcar alertas como leídas
- Indicadores visuales por prioridad

### 💡 Recomendaciones IA
- Tabs interactivas por categoría (Riego, Plagas, Nutrición, Malezas, Cosecha)
- Tarjetas con sugerencias personalizadas
- Botones para aplicar o rechazar recomendaciones

### 📄 Reportes
- Generador de reportes por período
- Exportación simulada a PDF y CSV
- Filtrado por parcela

### ⚙️ Configuración
- Selector de idioma (Español/Quechua)
- Control de tamaño de fuente para accesibilidad rural
- Botones para sincronizar y limpiar caché
- Diseño responsivo para dispositivos móviles

### 🔐 Autenticación
- Formulario de login visual funcional (sin bloqueo en demo)
- Listo para conectar a API real con promesas/fetch
- Almacenamiento de sesión en localStorage

---

## 🚀 Cómo Ejecutar

### Opción 1: Abrir directamente en el navegador
```bash
# Simplemente abre el archivo en tu navegador
file:///ruta/a/index.html
```

### Opción 2: Servidor Local (Recomendado)

**Con Python 3:**
```bash
cd /home/joseph/Escritorio/Agrotech-frontend
python -m http.server 8000
```

Luego accede a: `http://localhost:8000`

**Con Node.js (http-server):**
```bash
npm install -g http-server
cd /home/joseph/Escritorio/Agrotech-frontend
http-server -p 8000
```

Luego accede a: `http://localhost:8000`

**Con PHP:**
```bash
cd /home/joseph/Escritorio/Agrotech-frontend
php -S localhost:8000
```

Luego accede a: `http://localhost:8000`

---

## 📁 Estructura del Proyecto

```
Agrotech-frontend/
├── index.html                    # Punto de entrada HTML
├── css/
│   └── main.css                 # Sistema de diseño completo
├── js/
│   ├── app.js                   # Orquestador principal
│   ├── router.js                # Manejador de rutas
│   ├── i18n/
│   │   └── translations.js      # Sistema i18n (ES/QU)
│   ├── utils/
│   │   └── helpers.js           # Datos mockeados y funciones auxiliares
│   ├── modules/
│   │   ├── dashboard.module.js
│   │   ├── parcelas.module.js
│   │   ├── clima.module.js
│   │   ├── alertas.module.js
│   │   ├── recomendaciones.module.js
│   │   ├── reportes.module.js
│   │   ├── configuracion.module.js
│   │   └── auth.module.js
│   ├── services/
│   │   └── api.service.js       # (Preparado para futuras APIs)
│   └── config/
│       └── supabase.js          # (Preparado para Supabase)
├── pwa/
│   ├── manifest.json
│   └── service-worker.js
└── README.md
```

---

## 🎨 Sistema de Diseño

### Colores Primarios
- **Green (#10B981)** - Color principal
- **Emerald (#059669)** - Color oscuro
- **Yellow/Amber (#FBBF24 / #F59E0B)** - Advertencias
- **Red (#EF4444)** - Crítico
- **Blue (#3B82F6)** - Info

### Tipografía
- **Fuente:** Inter (variable, pesos 300-900)
- **Tamaños escalables:** Para accesibilidad rural

### Componentes Reutilizables
- Botones (.btn con variantes)
- Tarjetas (.card)
- Modales (.modal-overlay)
- Tabs (.tab-button)
- Badges (.badge)
- Alertas (.alert)

---

## 🌐 Idiomas Soportados

### Español (ES)
Interfaz completa en español moderno

### Quechua (QU)
Interfaz adaptada al quechua peruano para comunidades andinas

**Cambiar idioma:** Configuración → Idioma

---

## 📱 Responsividad

- ✓ Desktop (1920px+)
- ✓ Laptop (1200px+)
- ✓ Tablet (768px+)
- ✓ Mobile (320px+)
- ✓ Botones con mínimo 44px de altura (accesibilidad)

---

## 💾 Datos Mockeados

Todos los datos están en `/js/utils/helpers.js`:

### Datos Disponibles
- **Parcelas:** 3 parcelas de ejemplo
- **Cultivos:** 3 cultivos con ciclos agrícolas
- **Alertas:** 4 alertas con severidades
- **Clima:** Datos actuales + pronóstico 7 días
- **Recomendaciones IA:** Sugerencias por categoría
- **Reportes:** Ejemplos de reportes generados

### Agregar datos nuevos
```javascript
import { addParcela, deleteParcela } from './utils/helpers.js';

// Agregar parcela
const nueva = addParcela({
  nombre: 'Mi Parcela',
  area: 2.5,
  tipoSuelo: 'franco',
  fuenteAgua: 'riego'
});

// Eliminar parcela
deleteParcela(parcela_id);
```

---

## 🔌 Próximas Integraciones

### Base de Datos
El código está preparado para conectar a:
- **Supabase** (archivo en `/js/config/supabase.js`)
- **Firebase**
- **API REST personalizada**

### Ejemplo de conexión a API
```javascript
// En el módulo correspondiente:
async function fetchData() {
  try {
    const response = await fetch('https://api.agrotech.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 🎯 Casos de Uso

### 1. Agricultor Individual
- Monitoreo de sus parcelas
- Recepción de alertas climáticas
- Consulta de recomendaciones IA

### 2. Extensionista Agrícola
- Seguimiento de múltiples predios
- Generación de reportes para productores
- Análisis de datos climatológicos

### 3. Comunidad Rural Andina
- Interfaz disponible en Quechua
- Accesibilidad para usuarios con conexión limitada
- Sin dependencias externas

---

## 🔧 Personalización

### Cambiar colores
Edita `/css/main.css` - Variables CSS:
```css
:root {
  --color-primary: #10B981;
  --color-primary-dark: #059669;
  /* ... más variables */
}
```

### Agregar nueva ruta
1. Crear módulo en `/js/modules/nuevo.module.js`
2. Agregar a router.js:
```javascript
import { initNuevo } from './modules/nuevo.module.js';

const routes = {
  nuevo: { name: 'Nuevo', init: initNuevo, navId: 'nav-nuevo' }
};
```
3. Agregar botón en sidebar de index.html

### Agregar traducción
Edita `/js/i18n/translations.js`:
```javascript
es: {
  miClave: {
    texto: 'Valor en español'
  }
},
qu: {
  miClave: {
    texto: 'Valor en quechua'
  }
}
```

---

## ⚡ Rendimiento

- **Tamaño:** ~50KB (CSS + JS sin comprimir)
- **Carga:** < 2 segundos en conexión 3G
- **Sin dependencias externas:** Ideal para conexiones lentas
- **LocalStorage:** Almacenamiento local para datos de sesión

---

## 🐛 Debugging

### Ver logs en consola
```javascript
console.log('AgroTech iniciada');
```

### Inspeccionar localStorage
```javascript
console.log(localStorage.getItem('agrotech-user-session'));
```

### Modo demo
- Usuario: `demo@agrotech.com`
- Contraseña: `demo123`
- Acceso permitido para todas las funcionalidades

---

## 📚 Documentación Detallada

Cada módulo contiene comentarios JSDoc completos:
```javascript
/**
 * Inicializa el módulo de parcelas
 * @returns {void}
 */
export function initParcelas() { }
```

---

## 🤝 Contribuciones

Para agregar funcionalidades:
1. Seguir la estructura de módulos existentes
2. Usar sistema de traducción i18n
3. Mantener compatibilidad con ES6+ puro
4. Probar en múltiples resoluciones

---

## 📄 Licencia

Este proyecto está listo para uso en comunidades agrícolas de América Latina.

---

## ✅ Checklist de Funcionalidades

- [x] Dashboard con resumen
- [x] Gestión de parcelas con formulario modal
- [x] Monitoreo de clima
- [x] Sistema de alertas filtrable
- [x] Recomendaciones IA por categoría
- [x] Generador de reportes
- [x] Panel de configuración
- [x] Formulario de login
- [x] Soporte ES/QU bilingüe
- [x] Responsividad móvil
- [x] Accesibilidad (44px botones, zoom de fuente)
- [x] Datos mockeados completos
- [x] Arquitectura modular desacoplada
- [x] Sin dependencias externas

---

**¡Bienvenido a AgroTech!** 🌱🚀

Para soporte o consultas sobre la implementación, revisa los comentarios en el código.
