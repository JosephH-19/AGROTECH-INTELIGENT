#!/bin/bash

echo "📦 Instalando AgroTech..."

# Crear carpetas
mkdir -p js/modules js/i18n js/db js/services js/utils css pwa docs

# Copiar archivos
cp /mnt/user-data/outputs/app.js js/
cp /mnt/user-data/outputs/router.js js/
cp /mnt/user-data/outputs/index.html .
cp /mnt/user-data/outputs/translations.js js/i18n/
cp /mnt/user-data/outputs/indexeddb.js js/db/
cp /mnt/user-data/outputs/api.service.js js/services/
cp /mnt/user-data/outputs/dashboard.module.js js/modules/
cp /mnt/user-data/outputs/parcelas.module.js js/modules/
cp /mnt/user-data/outputs/clima.module.js js/modules/
cp /mnt/user-data/outputs/alertas.module.js js/modules/
cp /mnt/user-data/outputs/recomendaciones.module.js js/modules/
cp /mnt/user-data/outputs/reportes.module.js js/modules/
cp /mnt/user-data/outputs/admin.module.js js/modules/
cp /mnt/user-data/outputs/configuracion.module.js js/modules/
cp /mnt/user-data/outputs/manifest.json pwa/
cp /mnt/user-data/outputs/service-worker.js pwa/
cp /mnt/user-data/outputs/README.md .
cp /mnt/user-data/outputs/AGROTECH_DOCUMENTATION.md ./docs/
cp /mnt/user-data/outputs/GUIA_INTEGRACION.md .

echo "✅ ¡Instalación completada!"
echo ""
echo "Para iniciar:"
echo "  python3 -m http.server 8000"
echo ""
echo "Luego abre:"
echo "  http://localhost:8000"