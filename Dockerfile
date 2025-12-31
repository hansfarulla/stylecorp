# Build stage for Node.js assets
FROM node:20-alpine AS node-builder

























































































































































































































**Nota**: El archivo `nixpacks.toml` está incluido para desactivar Nixpacks y forzar el uso del Dockerfile. No lo elimines.---3. Revisa los permisos en `/data/coolify/`2. Verifica los logs del servidor de Coolify1. Revisa la documentación oficial: https://coolify.io/docsSi tienes problemas específicos con Coolify:## 📞 Soporte3. Asegúrate que Redis esté configurado y accesible2. Verifica logs: `supervisorctl tail -f laravel-queue`1. Los workers están incluidos en el contenedor (supervisor)### Workers de queue no procesan3. Revisa que el symlink de storage esté creado2. Asegúrate que Vite compiló los assets durante el build1. Verifica que `APP_URL` esté configurado correctamente### Assets no cargan (CSS/JS)3. Asegúrate que `DB_HOST` apunte al servicio correcto2. Comprueba las credenciales en las variables de entorno1. Verifica que el servicio MySQL esté corriendo### Error de base de datos3. Verifica que el health check pase2. Revisa los logs en Coolify1. Verifica que el puerto expuesto sea correcto (3000 o el que use Coolify)### La aplicación no responde## 🚨 Troubleshooting```supervisorctl tail -f laravel-schedule# Ver schedulersupervisorctl tail -f laravel-queue# Ver workers de queuesupervisorctl status# Estado de los servicios```bash### Comandos útiles (si tienes acceso SSH al contenedor):```# En Coolify UI → Tu servicio → Logs → "Follow Logs"```bash### Logs en tiempo real:## 📊 Monitoreo- ✅ Revisa los logs regularmente- ✅ Limita acceso a la base de datos solo desde la app- ✅ Configura **HTTPS** (Coolify lo hace automáticamente)- ✅ Genera un **APP_KEY único** para producción- ✅ Usa **contraseñas fuertes** para la base de datos- ✅ **APP_DEBUG=false** siempre en producción## 🔐 Seguridad en Producción| **Redis** | Incluido en compose | Servicio separado || **MySQL** | Incluido en compose | Servicio separado || **Variables** | Archivo `.env` | UI de Coolify || **Build** | Docker Compose | Dockerfile directo || **Puerto** | 8080:80 | Variable `PORT` (usualmente 3000) ||---------|---------------------------|---------|| Aspecto | Local (docker-compose.yml) | Coolify |## 🎯 Diferencias con Docker Compose Local   - Verifica que Laravel responde correctamente   - Accede a tu dominio3. **Prueba la aplicación**:   ```   # Debería responder: "healthy"   curl https://tu-dominio.com/health   ```bash2. **Verifica el health check**:   - Busca: "✅ Deployment complete!"   - En Coolify → Tu servicio → Logs1. **Revisa los logs**:## 🔍 Verificación Post-DespliegueSimplemente haz push a tu rama principal. Coolify se encargará del resto.### Despliegues posteriores:   - O presiona "Deploy" manualmente   - Coolify detectará el cambio automáticamente   - Haz push a tu repositorio Git3. **Despliega**:   - Agrega MySQL y Redis si los necesitas   - Selecciona **Dockerfile** como Build Pack   - Configura las variables de entorno (especialmente `APP_KEY`)   - Ve a tu proyecto en Coolify2. **Configura Coolify**:   ```   php artisan key:generate --show   # Localmente   ```bash1. **Genera APP_KEY**:### Primera vez:## 📝 Pasos para Desplegar   ```   sudo usermod -aG docker coolify   # Ajusta permisos según el usuario      ps aux | grep coolify   # Verifica el usuario que ejecuta Coolify   ```bash3. **Si persiste, ejecuta Coolify con privilegios adecuados**:   ```   sudo systemctl restart coolify   ```bash2. **Reinicia Coolify**:   ```   sudo chmod -R 755 /data/coolify/applications/   sudo chown -R coolify:coolify /data/coolify/applications/   # En el servidor de Coolify (SSH)   ```bash1. **Verifica permisos del usuario de Coolify**:### Solución:El error que experimentaste es un **problema de permisos en el servidor de Coolify**, NO de tu aplicación.## 🐛 Solución al Error "Permiso denegado"| `storage-logs` | `/var/www/html/storage/logs` | Logs de Laravel || `storage-app` | `/var/www/html/storage/app` | Archivos subidos ||--------------|-------------------|-------------|| Volumen Host | Volumen Contenedor | Descripción |Configura estos volúmenes en Coolify:### 4. **Volúmenes Persistentes**2. Actualiza `REDIS_HOST` a `redis` en las variables de entorno1. Agrega un nuevo servicio → Redis 7#### Agregar Redis (Recomendado)3. Configura las credenciales en las variables de entorno de la app2. Agrega un nuevo servicio → MySQL 8.01. En Coolify, ve a tu proyecto#### Agregar MySQL (Recomendado)### 3. **Servicios Adicionales**```TENANCY_DATABASE_AUTO_CREATE=trueTENANCY_DATABASE_AUTO_DELETE=falseCENTRAL_DOMAINS=tu-dominio.com# Multi-tenancyLOG_LEVEL=infoLOG_CHANNEL=stderr# LogREDIS_PORT=6379REDIS_PASSWORD=nullREDIS_HOST=redisQUEUE_CONNECTION=redisSESSION_DRIVER=redisCACHE_DRIVER=redis# Cache & Sessions (si usas Redis de Coolify)DB_PASSWORD=tu-password-seguroDB_USERNAME=stylecorpDB_DATABASE=stylecorpDB_PORT=3306DB_HOST=mysqlDB_CONNECTION=mysql# Database (si usas MySQL de Coolify)APP_URL=https://tu-dominio.comAPP_DEBUG=falseAPP_KEY=base64:tu-app-key-aquiAPP_ENV=productionAPP_NAME=StyleCorp# Laravel Core```envConfigura estas variables en Coolify:### 2. **Variables de Entorno**- **Health Check Port**: Variable `PORT` (automático)- **Health Check Path**: `/health`#### Health Check- **Port Exposes**: `3000` (Coolify usa este puerto por defecto)- **Dockerfile Path**: `Dockerfile`- **Build Pack**: `Dockerfile` (NO usar Nixpacks)#### GeneralEn la interfaz de Coolify, configura:### 1. **Configuración del Servicio**## 🔧 Configuración Requerida en Coolify
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source files needed for build
COPY resources ./resources
COPY public ./public
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY components.json ./

# Build assets
RUN npm run build

# PHP Dependencies stage
FROM composer:2 AS composer-builder

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies without dev dependencies
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application code
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --classmap-authoritative

# Final production stage
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    mysql-client \
    postgresql-client \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    oniguruma-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    bash \
    gettext

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo_mysql \
    pdo_pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip \
    opcache

# Install Redis extension
RUN apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Configure PHP for production
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
    && echo "opcache.enable=1" >> "$PHP_INI_DIR/php.ini" \
    && echo "opcache.memory_consumption=256" >> "$PHP_INI_DIR/php.ini" \
    && echo "opcache.max_accelerated_files=20000" >> "$PHP_INI_DIR/php.ini" \
    && echo "opcache.validate_timestamps=0" >> "$PHP_INI_DIR/php.ini" \
    && echo "upload_max_filesize=20M" >> "$PHP_INI_DIR/php.ini" \
    && echo "post_max_size=20M" >> "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html

# Copy application from composer stage
COPY --from=composer-builder /app /var/www/html

# Copy built assets from node stage
COPY --from=node-builder /app/public/build /var/www/html/public/build

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Configure Nginx
COPY docker/nginx/default.conf /etc/nginx/http.d/default.conf.template

# Configure Supervisor
COPY docker/supervisor/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy startup script
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

# Create necessary directories
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/framework/cache \
    && chown -R www-data:www-data /var/www/html/storage

# Expose port (Coolify will override this with PORT env var)
EXPOSE 80
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD curl -f http://localhost/health || exit 1

# Start services with startup script
CMD ["/usr/local/bin/start.sh"]
