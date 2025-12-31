#!/bin/bash
set -e

echo "🚀 Starting StyleCorp deployment..."


# Espera hasta 2 minutos por la base de datos
echo "⏳ Waiting for database (timeout 120s)..."
MAX_ATTEMPTS=60
ATTEMPT=1
until php artisan db:show 2>/dev/null; do
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
php artisan migrate --force

# Clear and cache config
echo "🗑️ Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "📦 Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create storage symlink if it doesn't exist
if [ ! -L "/var/www/html/public/storage" ]; then
    echo "🔗 Creating storage symlink..."
    php artisan storage:link
fi

# Set permissions
echo "🔒 Setting permissions..."
chown -R www-data:www-data /var/www/html/storage
chown -R www-data:www-data /var/www/html/bootstrap/cache

echo "✅ Deployment complete!"

# Start supervisor
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
