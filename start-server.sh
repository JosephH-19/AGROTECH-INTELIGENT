#!/bin/bash

# AgroTech - Script de Servidor
# Inicia un servidor web local

PORT="${1:-8000}"

echo "🌾 AgroTech - Servidor Web"
echo "=========================="
echo ""
echo "🚀 Iniciando servidor en puerto $PORT..."
echo "📱 URL Local: http://localhost:$PORT"
echo "🔍 Verificador: http://localhost:$PORT/verificador.html"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

python3 -m http.server $PORT --bind 0.0.0.0
