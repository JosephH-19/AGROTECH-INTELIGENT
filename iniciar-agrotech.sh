#!/bin/bash

# 🌱 AgroTech - Script de Inicio Rápido
# Inicia un servidor local para la aplicación

echo "🌱 AgroTech - Iniciando servidor local..."
echo ""
echo "=========================================="
echo ""

# Verifica si Python está disponible
if command -v python3 &> /dev/null; then
    echo "✓ Python 3 encontrado"
    echo "📍 Iniciando servidor en http://localhost:8000"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    echo ""
    cd "$(dirname "$0")"
    python3 -m http.server 8000
    
elif command -v python &> /dev/null; then
    echo "✓ Python encontrado"
    echo "📍 Iniciando servidor en http://localhost:8000"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    echo ""
    cd "$(dirname "$0")"
    python -m SimpleHTTPServer 8000
    
elif command -v php &> /dev/null; then
    echo "✓ PHP encontrado"
    echo "📍 Iniciando servidor en http://localhost:8000"
    echo ""
    echo "Presiona Ctrl+C para detener el servidor"
    echo ""
    cd "$(dirname "$0")"
    php -S localhost:8000
    
else
    echo "✗ No se encontró Python ni PHP"
    echo ""
    echo "Instala alguno de estos para ejecutar AgroTech:"
    echo "  - Python 3: sudo apt-get install python3"
    echo "  - PHP: sudo apt-get install php"
    echo ""
    echo "O abre directamente en tu navegador:"
    echo "  file://$(pwd)/index.html"
fi
echo "  ✓ Carpetas verificadas"

# 2. Verificar archivos principales
echo ""
echo "✓ Verificando archivos..."

required_files=(
    "index.html"
    "js/app.js"
    "js/router.js"
    "js/i18n/translations.js"
    "js/db/indexeddb.js"
    "js/services/api.service.js"
    "js/utils/helpers.js"
    "pwa/manifest.json"
    "pwa/service-worker.js"
)

missing_files=0
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ⚠️  $file (revisar)"
        ((missing_files++))
    fi
done

# 3. Crear main.css si no existe
echo ""
echo "✓ Verificando estilos..."

if [ ! -f "css/main.css" ]; then
    cat > css/main.css << 'CSS_EOF'
/* AgroTech - Estilos Principales */

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #10b981;
    --secondary-color: #1e3a8a;
    --danger-color: #ef4444;
    --warning-color: #f59e0b;
    --success-color: #10b981;
    --text-color: #1f2937;
    --border-color: #e5e7eb;
    --bg-color: #f9fafb;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: var(--text-color);
    background-color: var(--bg-color);
    line-height: 1.6;
}

/* Layout Principal */
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
header {
    background: linear-gradient(135deg, var(--secondary-color) 0%, var(--primary-color) 100%);
    color: white;
    padding: 20px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

header h1 {
    font-size: 28px;
    margin-bottom: 5px;
}

header p {
    opacity: 0.9;
    font-size: 14px;
}

/* Navigation */
nav {
    background: white;
    border-bottom: 1px solid var(--border-color);
    padding: 0;
}

nav ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
}

nav li a {
    display: block;
    padding: 15px 20px;
    color: var(--text-color);
    text-decoration: none;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;
}

nav li a:hover,
nav li a.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
    background: var(--bg-color);
}

/* Main Content */
main {
    min-height: calc(100vh - 200px);
    padding: 30px 0;
}

.content-section {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.content-section h2 {
    color: var(--secondary-color);
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid var(--border-color);
}

/* Cards */
.card {
    background: white;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.card h3 {
    color: var(--secondary-color);
    margin-bottom: 10px;
}

/* Buttons */
button, .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

button:hover, .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: #059669;
}

.btn-secondary {
    background: #e5e7eb;
    color: var(--text-color);
}

.btn-secondary:hover {
    background: #d1d5db;
}

.btn-danger {
    background: var(--danger-color);
    color: white;
}

.btn-danger:hover {
    background: #dc2626;
}

/* Forms */
input, select, textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    margin-bottom: 15px;
}

input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: var(--text-color);
}

/* Alerts */
.alert {
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 20px;
    border-left: 4px solid;
}

.alert-success {
    background: #ecfdf5;
    color: #065f46;
    border-left-color: var(--success-color);
}

.alert-error {
    background: #fef2f2;
    color: #991b1b;
    border-left-color: var(--danger-color);
}

.alert-warning {
    background: #fffbf0;
    color: #92400e;
    border-left-color: var(--warning-color);
}

/* Footer */
footer {
    background: var(--secondary-color);
    color: white;
    padding: 20px 0;
    text-align: center;
    margin-top: 40px;
    font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
    header h1 {
        font-size: 24px;
    }
    
    nav ul {
        flex-direction: column;
    }
    
    nav li a {
        border-bottom: none;
        border-left: 4px solid transparent;
    }
    
    nav li a:hover,
    nav li a.active {
        border-left-color: var(--primary-color);
    }
    
    .content-section {
        padding: 20px;
    }
    
    button, .btn {
        width: 100%;
    }
}

/* Utilities */
.text-center {
    text-align: center;
}

.text-right {
    text-align: right;
}

.mt-3 {
    margin-top: 30px;
}

.mb-3 {
    margin-bottom: 30px;
}

.hidden {
    display: none;
}

.loading {
    opacity: 0.6;
    pointer-events: none;
}

.spinner {
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
CSS_EOF
    echo "  ✓ css/main.css creado"
else
    echo "  ✓ css/main.css ya existe"
fi

# 4. Crear start-server.sh
echo ""
echo "✓ Creando script de servidor..."

if [ ! -f "start-server.sh" ]; then
    cat > start-server.sh << 'SERVER_EOF'
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
SERVER_EOF
    chmod +x start-server.sh
    echo "  ✓ start-server.sh creado"
else
    echo "  ✓ start-server.sh ya existe"
fi

# 5. Limpiar archivos temporales
echo ""
echo "✓ Limpiando archivos temporales..."

# Remover archivos .deb si existen
rm -f ./*.deb 2>/dev/null && echo "  ✓ Archivos .deb removidos" || true

# Remover duplicados si existen
if [ -d ".duplicates" ]; then
    rm -rf .duplicates
    echo "  ✓ Carpeta de duplicados removida"
fi

# 6. Información final
echo ""
echo "✅ ¡LISTO PARA INICIAR!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Ejecuta: bash start-server.sh"
echo "   2. Abre en navegador: http://localhost:8000"
echo "   3. Primero visita: http://localhost:8000/verificador.html"
echo "   4. Presiona F12 para ver la consola"
echo ""
echo "📁 Archivos creados:"
echo "   ✓ verificador.html"
echo "   ✓ css/main.css"
echo "   ✓ start-server.sh"
echo ""

if [ $missing_files -gt 0 ]; then
    echo "⚠️  Nota: $missing_files archivo(s) para revisar"
fi

echo ""
echo "🎉 AgroTech está listo para usarse"
