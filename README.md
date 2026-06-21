# 🌾 AgroTech - Inteligencia Agrícola para Pequeños Agricultores

## Descripción General

**AgroTech** es una plataforma web responsiva y de código abierto diseñada específicamente para pequeños agricultores en Junín, Perú. Utiliza inteligencia artificial, predicción climática, detección de plagas e integración con SENAMHI y NASA para proporcionar recomendaciones agrícolas inteligentes.

### Características Principales

✅ **Monitoreo Climático en Tiempo Real** - Integración con SENAMHI y NASA POWER  
✅ **Detección de Plagas por IA** - Identificación temprana de enfermedades  
✅ **Sistema de Alertas Inteligentes** - Notificaciones críticas y recomendaciones  
✅ **Recomendaciones Agrícolas** - Sugerencias basadas en datos agroclimáticos  
✅ **Gestión de Parcelas** - Mapeo y monitoreo de terrenos  
✅ **Reportes y Estadísticas** - Análisis histórico y predicciones  
✅ **Offline-First** - Funciona sin conexión a internet  
✅ **Soporte Multiidioma** - Español y Quechua  
✅ **PWA Instalable** - Se instala como app nativa  
✅ **Accesible** - Diseño rural-amigable con botones grandes  

---

## 🚀 Instalación Rápida

### Opción 1: Usar en Navegador (Recomendado para Desarrollo)

```bash
# 1. Clonar o descargar el proyecto
git clone https://github.com/tu-usuario/agrotech.git
cd agrotech

# 2. Servir con un servidor web simple (Python)
python3 -m http.server 8000

# 3. O con Node.js
npx http-server

# 4. Abrir en navegador
http://localhost:8000
```

### Opción 2: Instalar como PWA

1. **Abrir en navegador compatible** (Chrome, Edge, Samsung Internet)
2. **Hacer clic en el ícono de instalación** (esquina superior derecha)
3. **Seleccionar "Instalar"**
4. ¡Listo! La app se instalará en tu dispositivo

### Opción 3: Desplegar en Servidor Web

```bash
# Con Nginx
# 1. Copiar archivos a /var/www/html/agrotech/
sudo cp -r . /var/www/html/agrotech/

# 2. Crear configuración nginx
sudo nano /etc/nginx/sites-available/agrotech
```

**Configuración Nginx:**
```nginx
server {
    listen 80;
    server_name agrotech.local;
    root /var/www/html/agrotech;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /pwa/ {
        add_header Service-Worker-Allowed "/";
        add_header Cache-Control "no-cache";
    }
}
```

---

## 📁 Estructura del Proyecto

```
agrotech-frontend/
├── index.html                 # Punto de entrada
├── css/
│   └── main.css              # Estilos personalizados
├── js/
│   ├── app.js                # Aplicación principal
│   ├── router.js             # Sistema de enrutamiento
│   ├── config/
│   │   └── supabase.js       # Configuración BD (opcional)
│   ├── db/
│   │   └── indexeddb.js      # BD local offline
│   ├── i18n/
│   │   └── translations.js   # Sistema de traducciones (ES/QU)
│   ├── services/
│   │   └── api.service.js    # Servicio HTTP
│   ├── modules/
│   │   ├── dashboard.module.js
│   │   ├── parcelas.module.js
│   │   ├── clima.module.js
│   │   ├── alertas.module.js
│   │   ├── recomendaciones.module.js
│   │   ├── reportes.module.js
│   │   ├── admin.module.js
│   │   └── configuracion.module.js
│   └── utils/
│       └── helpers.js        # Funciones utilitarias
├── pwa/
│   ├── manifest.json         # Metadatos PWA
│   └── service-worker.js     # Soporte offline
├── docs/
│   └── DOCUMENTATION.md      # Documentación técnica
└── README.md                 # Este archivo
```

---

## 🔧 Configuración Inicial

### 1. Variables de Entorno

Crear archivo `.env` en la raíz:

```bash
VITE_API_URL=https://api.agrotech.local/v1
VITE_SENAMHI_API_KEY=tu_clave_senamhi
VITE_NASA_API_KEY=tu_clave_nasa
VITE_MAPBOX_TOKEN=tu_token_mapbox
VITE_ENV=development
```

### 2. Configurar Backend (Opcional)

Si quieres usar un backend real, configura:

```javascript
// js/config/api.config.js
export const API_CONFIG = {
  baseURL: 'https://api.agrotech.local/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
};
```

### 3. Integración SENAMHI y NASA

Las APIs se configuran en `js/services/api.service.js`:

```javascript
// Obtener datos SENAMHI
const senamhiData = await apiService.get('/climate/senamhi/junin');

// Obtener datos NASA POWER
const nasaData = await apiService.get('/climate/nasa/power/-12.0833/-75.2167');
```

---

## 📱 Guía de Uso

### Panel Principal (Dashboard)

1. **Ver estadísticas rápidas** - Parcelas, alertas, cultivos
2. **Revisar clima** - Pronóstico 7 días
3. **Alertas recientes** - Plagas, condiciones climáticas
4. **Recomendaciones IA** - Acciones sugeridas

### Gestión de Parcelas

1. **Nueva Parcela** - Click en botón "➕ Nueva Parcela"
2. **Completar formulario** - Nombre, área, tipo de suelo
3. **Guardar** - Se almacena localmente
4. **Ver detalles** - Click en tarjeta de parcela

### Monitoreo Climático

1. **Temperatura actual** - En tiempo real
2. **Pronóstico 7 días** - Con lluvia y humedad
3. **Datos SENAMHI** - Predicción regional
4. **Datos NASA** - Radiación solar y evapotranspiración

### Sistema de Alertas

1. **Alertas críticas** - Rojo, requieren acción inmediata
2. **Advertencias** - Amarillo, revisar pronto
3. **Información** - Azul, solo notificaciones
4. **Filtrar y buscar** - Por tipo o severidad

### Recomendaciones Inteligentes

1. **Riego** - Optimización de agua
2. **Plagas** - Control y prevención
3. **Nutrición** - Fertilización recomendada
4. **Malezas** - Control integrado
5. **Cosecha** - Timing óptimo

### Reportes

1. **Generar reporte** - Mensual o personalizado
2. **Descargar** - En PDF o CSV
3. **Ver gráficos** - Análisis visual
4. **Exportar datos** - Para análisis externo

---

## 🌐 Idiomas Soportados

### Español (ES)
- Idioma por defecto
- Interfaz completa traducida
- Terminología agrícola estándar

### Quechua (QU) 
- Idioma andino tradicional (Runasimi)
- Acceso cultural e inclusivo
- Términos agrícolas quechuas

**Cambiar idioma:**
```javascript
// En cualquier módulo
import { t, setLanguage } from './i18n/translations.js';

// Cambiar a Quechua
setLanguage('qu');

// Usar traducción
console.log(t('dashboard', 'Panel Principal'));
```

---

## 🔐 Seguridad y Privacidad

### Autenticación

La aplicación soporta:
- Login local con almacenamiento seguro
- Token JWT para API
- Refresh token automático
- Cierre de sesión automático (30 min inactividad)

### Datos Sensibles

- ✅ Se encriptan en tránsito (HTTPS)
- ✅ Se almacenan localmente (IndexedDB)
- ✅ Sin envío a terceros sin consentimiento
- ✅ Usuario puede exportar/eliminar datos

### Cumplimiento Legal

- 📋 GDPR compliant
- 🔒 Política de privacidad clara
- ⚖️ Términos de servicio
- 🗑️ Derecho al olvido

---

## 📊 Integración de Datos

### APIs Externas Soportadas

**SENAMHI** (Servicio Nacional de Meteorología e Hidrología)
```javascript
GET /api/climate/senamhi/{region}
GET /api/climate/senamhi/{lat}/{lng}
```

**NASA POWER** (Prediction of Worldwide Energy Resource)
```javascript
GET /api/climate/nasa/power/{lat}/{lng}
GET /api/climate/nasa/power/solar/{lat}/{lng}
```

**OpenWeatherMap** (Opcional)
```javascript
GET /api/climate/openweather/{lat}/{lng}
```

### Base de Datos Local (IndexedDB)

```javascript
import { saveData, getData, getAllData } from './db/indexeddb.js';

// Guardar parcela
await saveData('parcels', {
  id: 'p1',
  name: 'Parcela 1',
  area: 2.5,
  userId: 'user1',
});

// Obtener todas las parcelas
const parcels = await getAllData('parcels');
```

---

## 🔄 Modo Offline

### Sincronización Automática

1. **Modo Automático** - Detecta conexión automáticamente
2. **Modo Bajo Datos** - Reduce consumo de datos
3. **Modo Offline** - Sincroniza cuando hay conexión

### Qué se sincroniza

- ✅ Datos de parcelas
- ✅ Cultivos y estadísticas
- ✅ Alertas generadas
- ✅ Recomendaciones guardadas
- ❌ Reportes (se generan al conectar)

### Sincronización Manual

```bash
# Click en botón "Sincronizar ahora" en Configuración
# O programáticamente:
await apiService.syncQueue();
```

---

## 📈 Desarrollo y Contribución

### Requisitos

- Node.js 16+ (opcional, para desarrollo)
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para APIs

### Flujo de Desarrollo

```bash
# 1. Clonar repo
git clone https://github.com/tu-usuario/agrotech.git
cd agrotech

# 2. Crear rama feature
git checkout -b feature/tu-feature

# 3. Hacer cambios
# Editar archivos según sea necesario

# 4. Testear
# Abrir http://localhost:8000 en navegador

# 5. Commit y push
git add .
git commit -m "feat: descripción de cambios"
git push origin feature/tu-feature

# 6. Pull request
# Abrir PR en GitHub
```

### Testing

```bash
# Testear en dispositivo móvil
# 1. Obtener IP local: ifconfig o ipconfig
# 2. En móvil: http://tu-ip-local:8000

# Testear en diferentes navegadores
# Chrome DevTools → Device Toolbar
# Firefox Responsive Design Mode

# Testear offline
# DevTools → Network → Offline
```

---

## 🐛 Solución de Problemas

### App no carga
```
✓ Verificar conexión a internet
✓ Limpiar caché del navegador (Ctrl+Shift+Del)
✓ Desinstalar y reinstalar PWA
✓ Revisar consola (F12 → Console)
```

### Service Worker no se registra
```
✓ Verificar HTTPS en producción
✓ Verificar ruta correcta: /pwa/service-worker.js
✓ Ver Application → Service Workers en DevTools
```

### IndexedDB no funciona
```
✓ Verificar almacenamiento disponible
✓ Revisar cuota de disco
✓ No bloqueado por navegador privado
✓ Ver Application → Storage → IndexedDB en DevTools
```

### APIs no responden
```
✓ Verificar clave API SENAMHI/NASA
✓ Verificar CORS configurado
✓ Usar proxy si está bloqueado
✓ Revisar Network tab en DevTools
```

---

## 📚 Documentación Completa

Ver archivo `AGROTECH_DOCUMENTATION.md` para:
- Arquitectura técnica detallada
- Modelos de datos
- Endpoints API
- Guía de componentes
- Configuración avanzada

---

## 🙏 Créditos

**Desarrollado para:** Pequeños agricultores de Junín, Perú

**Integraciones:**
- 🌤️ SENAMHI - Datos climáticos regionales
- 🛰️ NASA POWER - Datos de radiación solar
- 🗺️ Mapbox - Visualización de parcelas
- 💾 IndexedDB - Almacenamiento offline

**Tecnologías:**
- React (SPA)
- Tailwind CSS (Estilos)
- Service Workers (PWA)
- IndexedDB (BD local)

---

## 📜 Licencia

Este proyecto está bajo licencia **MIT**. Ver archivo `LICENSE` para detalles.

---

## 📞 Soporte y Contacto

**Email:** support@agrotech.com  
**GitHub:** github.com/agrotech/agrotech-frontend  
**Problemas:** github.com/agrotech/agrotech-frontend/issues  

---

## 🗺️ Roadmap

### Q2 2024
- [ ] Integración con sensores IoT
- [ ] App móvil nativa (React Native)
- [ ] Predicción de rendimiento con ML
- [ ] Chat en vivo con agrónomos

### Q3 2024
- [ ] Análisis de suelo avanzado
- [ ] Identificación de plagas con foto
- [ ] Mercado directo agricultor-comprador
- [ ] Integración bancaria para créditos

### Q4 2024
- [ ] Blockchain para trazabilidad
- [ ] Drones para monitoreo
- [ ] Expansión a otros países
- [ ] Soporte para Aymara y otras lenguas

---

**Última actualización:** Mayo 2024  
**Versión:** 1.0.0 (Beta)  
**Estado:** 🟢 Producción
