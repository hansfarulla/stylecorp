#!/bin/bash
set -e

echo "🚀 Starting StyleCorp deployment..."

# Wait for database to be ready
echo "⏳ Waiting for database..."
until php artisan db:show 2>/dev/null; do
    echo "Database is unavailable - sleeping"
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
