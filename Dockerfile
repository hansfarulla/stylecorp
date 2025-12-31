
# Etapa Node: solo instala dependencias
FROM node:20-alpine AS node-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production=false

# Etapa Composer: PHP + Node para build de assets
FROM composer:2 AS composer-builder
WORKDIR /app

# Copia composer files y node_modules
COPY composer.json composer.lock ./
COPY --from=node-deps /app/node_modules ./node_modules
COPY package*.json ./

# Instala dependencias PHP
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copia el resto del código
COPY . .

# Genera autoloader optimizado
RUN composer dump-autoload --optimize --classmap-authoritative

# Build de assets (Vite) usando PHP disponible
RUN apk add --no-cache nodejs npm
RUN npm run build

# Etapa final: solo PHP-FPM, Nginx, Supervisor
FROM php:8.2-fpm-alpine

# Instala dependencias del sistema necesarias
RUN apk add --no-cache \
    nginx \
    supervisor \
    mysql-client \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    bash

# Instala extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache

# Instala Redis extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Configura PHP para producción
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && echo "opcache.enable=1" >> "$PHP_INI_DIR/php.ini" \
    && echo "opcache.memory_consumption=256" >> "$PHP_INI_DIR/php.ini" \
    && echo "opcache.max_accelerated_files=20000" >> "$PHP_INI_DIR/php.ini" \
    && echo "opcache.validate_timestamps=0" >> "$PHP_INI_DIR/php.ini" \
    && echo "upload_max_filesize=20M" >> "$PHP_INI_DIR/php.ini" \
    && echo "post_max_size=20M" >> "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html

# Copia todo el código y assets ya buildados
COPY --from=composer-builder /app /var/www/html

# Permisos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Configuración Nginx
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf

# Configuración Supervisor
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Script de inicio
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Crea directorios necesarios
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/framework/cache \
    && chown -R www-data:www-data /var/www/html/storage

# Exponer puerto
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD curl -f http://localhost/health || exit 1

# Comando de inicio
CMD ["/usr/local/bin/start.sh"]
