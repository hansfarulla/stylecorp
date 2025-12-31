#!/bin/bash
# Script para corregir permisos en el servidor de Coolify
# Ejecuta esto en el servidor de Coolify (no localmente)

echo "🔧 Corrigiendo permisos de Coolify..."

# Obtener el usuario que ejecuta Coolify
COOLIFY_USER=$(ps aux | grep coolify | grep -v grep | awk '{print $1}' | head -n 1)

if [ -z "$COOLIFY_USER" ]; then
    echo "⚠️  No se pudo detectar el usuario de Coolify. Usando 'coolify' por defecto."
    COOLIFY_USER="coolify"
fi

echo "👤 Usuario de Coolify detectado: $COOLIFY_USER"

# Corregir permisos del directorio de aplicaciones
echo "📁 Corrigiendo permisos en /data/coolify/applications..."
sudo chown -R $COOLIFY_USER:$COOLIFY_USER /data/coolify/applications/
sudo chmod -R 755 /data/coolify/applications/

# Asegurar que el usuario esté en el grupo docker
echo "🐳 Añadiendo usuario al grupo docker..."
sudo usermod -aG docker $COOLIFY_USER

# Verificar permisos
echo "✅ Verificando permisos..."
ls -la /data/coolify/applications/ | head -n 5

echo ""
echo "🎯 Pasos siguientes:"
echo "1. Reinicia Coolify: sudo systemctl restart coolify"
echo "2. En la UI de Coolify, configura tu app para usar 'Dockerfile' (no Nixpacks)"
echo "3. Intenta desplegar de nuevo"
