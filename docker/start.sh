#!/bin/bash

# Salir si cualquier comando falla, pero mostrar el error
set -eE
trap 'echo "❌ Error en línea $LINENO: $BASH_COMMAND"' ERR


echo "🚀 Starting StyleCorp deployment..."


# Espera hasta 2 minutos por la base de datos

echo "⏳ Waiting for database (timeout 120s)..."
MAX_ATTEMPTS=60
ATTEMPT=1
until php artisan db:show 2>&1; do
    if [ $ATTEMPT -ge $MAX_ATTEMPTS ]; then
        echo "❌ Database is still unavailable after $((MAX_ATTEMPTS*2)) seconds. Exiting."
        exit 1
    fi
    echo "Database is unavailable - sleeping ($ATTEMPT/$MAX_ATTEMPTS)"
    ATTEMPT=$((ATTEMPT+1))
    sleep 2
done

echo "✅ Database is ready!"


# Run migrations
echo "🔄 Running migrations..."
if ! php artisan migrate --force; then
    echo "❌ Error al ejecutar migraciones."
    exit 2
fi


# Clear and cache config
echo "🗑️ Clearing caches..."
if ! php artisan config:clear; then echo "❌ config:clear falló"; fi
if ! php artisan cache:clear; then echo "❌ cache:clear falló"; fi
if ! php artisan route:clear; then echo "❌ route:clear falló"; fi
if ! php artisan view:clear; then echo "❌ view:clear falló"; fi

echo "📦 Optimizing application..."
if ! php artisan config:cache; then echo "❌ config:cache falló"; fi
if ! php artisan route:cache; then echo "❌ route:cache falló"; fi
if ! php artisan view:cache; then echo "❌ view:cache falló"; fi


# Create storage symlink if it doesn't exist
if [ ! -L "/var/www/html/public/storage" ]; then
    echo "🔗 Creating storage symlink..."
    if ! php artisan storage:link; then echo "❌ storage:link falló"; fi
fi


# Set permissions
echo "🔒 Setting permissions..."
if ! chown -R www-data:www-data /var/www/html/storage; then echo "❌ chown storage falló"; fi
if ! chown -R www-data:www-data /var/www/html/bootstrap/cache; then echo "❌ chown cache falló"; fi


echo "✅ Deployment complete!"


# Start supervisor
echo "🟢 Lanzando supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
