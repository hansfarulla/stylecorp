# Docker Setup - StyleCorp

## 📋 Archivos Creados

- **Dockerfile**: Imagen multi-stage optimizada para producción
- **docker-compose.yml**: Orquestación de servicios (App, MySQL, Redis)
- **.dockerignore**: Exclusiones para optimizar el build
- **docker/nginx/default.conf**: Configuración de Nginx
- **docker/supervisor/supervisord.conf**: Gestión de procesos (PHP-FPM, Nginx, Queue, Scheduler)
- **docker/start.sh**: Script de inicialización

## 🚀 Uso

### Desarrollo Local con Docker Compose

```bash
# Construir y levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Ejecutar comandos artisan
docker-compose exec app php artisan migrate

# Detener servicios
docker-compose down
```

La aplicación estará disponible en: http://localhost:8080

### Construcción de la Imagen

```bash
# Build de la imagen
docker build -t stylecorp:latest .

# Build con plataforma específica (ej: para ARM64)
docker build --platform linux/arm64 -t stylecorp:latest .
```

### Ejecución Manual

```bash
# Ejecutar el contenedor
docker run -d \
  --name stylecorp-app \
  -p 8080:80 \
  -e APP_ENV=production \
  -e APP_KEY=base64:your-app-key-here \
  -e DB_HOST=your-db-host \
  -e DB_DATABASE=stylecorp \
  -e DB_USERNAME=stylecorp \
  -e DB_PASSWORD=secret \
  -e REDIS_HOST=redis \
  stylecorp:latest
```

## 🔧 Configuración

### Variables de Entorno Requeridas

```env
APP_NAME=StyleCorp
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=stylecorp
DB_USERNAME=stylecorp
DB_PASSWORD=secret

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## 🏗️ Arquitectura del Contenedor

### Multi-Stage Build

1. **node-builder**: Compila assets de React/Vite
2. **composer-builder**: Instala dependencias PHP optimizadas
3. **Final stage**: Imagen Alpine ligera con PHP-FPM + Nginx

### Servicios Incluidos (Supervisor)

- **PHP-FPM**: Procesador PHP (puerto 9000)
- **Nginx**: Servidor web (puerto 80)
- **Laravel Queue Workers**: 2 workers para procesamiento de colas
- **Laravel Scheduler**: Ejecuta tareas programadas cada minuto

### Health Check

El contenedor incluye un health check en `/health` que verifica que Nginx y PHP-FPM están respondiendo.

## 🎯 Optimizaciones Aplicadas

- ✅ Multi-stage build para reducir tamaño final
- ✅ OPcache configurado para máximo rendimiento
- ✅ Assets pre-compilados (Vite)
- ✅ Autoloader optimizado (classmap-authoritative)
- ✅ Configuración de producción de PHP
- ✅ Caching de rutas, vistas y configuración
- ✅ Redis para sesiones, cache y colas
- ✅ Permisos correctos en storage y bootstrap/cache
- ✅ Health checks para Kubernetes/Docker Swarm

## 🐛 Troubleshooting

### Ver logs en tiempo real
```bash
docker-compose logs -f app
```

### Acceder al contenedor
```bash
docker-compose exec app sh
```

### Limpiar y reconstruir
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

### Verificar estado de los servicios
```bash
docker-compose exec app supervisorctl status
```

## 📦 Tamaño de la Imagen

La imagen final debería ser aproximadamente **200-300 MB** gracias a:
- Base Alpine Linux
- Multi-stage build
- .dockerignore optimizado
- Sin dependencias de desarrollo

## 🔒 Seguridad

- PHP en modo producción
- Nginx configurado con headers de seguridad
- Sin acceso a archivos .env en tiempo de build
- Permisos restrictivos en archivos sensibles
- Health checks para detectar fallos

## 🌐 Despliegue en Producción

Para producción, considera:

1. **Usar un registro privado de contenedores**
2. **Configurar variables de entorno vía secrets**
3. **Usar volúmenes persistentes para storage**
4. **Configurar logging centralizado**
5. **Implementar SSL/TLS con un reverse proxy**
6. **Escalar workers de colas según carga**

Ejemplo con Kubernetes:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stylecorp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: stylecorp
  template:
    metadata:
      labels:
        app: stylecorp
    spec:
      containers:
      - name: app
        image: your-registry/stylecorp:latest
        ports:
        - containerPort: 80
        env:
        - name: APP_KEY
          valueFrom:
            secretKeyRef:
              name: stylecorp-secrets
              key: app-key
```
