# 🚀 Despliegue en Coolify - StyleCorp

## ⚠️ PROBLEMA DETECTADO

Tu deployment está fallando por **DOS razones**:

1. ❌ **Coolify está usando Nixpacks** (debe usar Dockerfile)
2. ❌ **Error de permisos en el servidor** de Coolify

## 🔧 SOLUCIÓN RÁPIDA

### 1. Cambiar a Dockerfile en Coolify UI ⭐ CRÍTICO

**En la interfaz web de Coolify**:

1. Ve a tu aplicación → **Configuration**
2. Busca la sección **"Build"** o **"General"**
3. Cambia:
   - **Build Pack**: `Dockerfile` ← (NO Nixpacks)
   - **Dockerfile Location**: `Dockerfile`
4. En **"Network"**:
   - **Port Exposes**: `80`
5. **Guarda** y despliega de nuevo

### 2. Corregir Permisos del Servidor (SSH)

**Conéctate al servidor de Coolify**:

```bash
# Opción A: Usar el script incluido
scp fix-coolify-permissions.sh tu-servidor:~/
ssh tu-servidor
bash ~/fix-coolify-permissions.sh

# Opción B: Manual
ssh tu-servidor

# Detectar usuario de Coolify
COOLIFY_USER=$(ps aux | grep coolify | grep -v grep | awk '{print $1}' | head -n 1)

# Corregir permisos
sudo chown -R $COOLIFY_USER:$COOLIFY_USER /data/coolify/applications/
sudo chmod -R 755 /data/coolify/applications/
sudo usermod -aG docker $COOLIFY_USER

# Reiniciar Coolify
sudo systemctl restart coolify
```

---

## 📋 Configuración Completa de Coolify

### Variables de Entorno Requeridas

Configura estas variables en la UI de Coolify:

```env
# Laravel Core
APP_NAME=StyleCorp
APP_ENV=production
APP_KEY=base64:tu-app-key-aqui
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# Database
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=stylecorp
DB_USERNAME=stylecorp
DB_PASSWORD=tu-password-seguro

# Cache & Sessions
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
REDIS_HOST=redis
REDIS_PORT=6379

# Multi-tenancy
CENTRAL_DOMAINS=tu-dominio.com

# Logs
LOG_CHANNEL=stderr
LOG_LEVEL=info
```

### Servicios Adicionales

#### MySQL 8.0
1. En Coolify → Añadir Servicio → MySQL 8.0
2. Copia las credenciales a las variables de entorno de tu app

#### Redis 7
1. En Coolify → Añadir Servicio → Redis 7  
2. El host será automáticamente `redis`

### Volúmenes Persistentes

| Contenedor | Host | Descripción |
|-----------|------|-------------|
| `/var/www/html/storage/app` | `storage-app` | Archivos subidos |
| `/var/www/html/storage/logs` | `storage-logs` | Logs |

---

## 🐛 Troubleshooting

### "Permiso denegado" al desplegar

**Causa**: Permisos incorrectos en `/data/coolify/` del servidor.

**Solución**: Ver sección "Corregir Permisos" arriba.

### Sigue usando Nixpacks

**Causa**: Build Pack no está configurado como "Dockerfile".

**Solución**:
1. Configuration → Build → Build Pack → **Dockerfile**
2. Si no aparece la opción, crea un archivo `.coolify/config.json`:

```json
{
  "buildpack": "dockerfile"
}
```

### La app no inicia

1. **Revisa los logs** en Coolify → Logs
2. **Verifica que APP_KEY esté configurado**:
   ```bash
   # Genera uno nuevo localmente
   php artisan key:generate --show
   ```
3. **Asegúrate que la base de datos esté accesible**

### Error "No such file or directory: vendor/autoload.php"

Esto significa que Nixpacks no instaló las dependencias PHP.

**Solución**: Asegúrate que estás usando **Dockerfile** (no Nixpacks).

---

## ✅ Verificación Post-Despliegue

1. **Health check funciona**:
   ```bash
   curl https://tu-dominio.com/health
   # Debe responder: "healthy"
   ```

2. **Logs muestran inicio exitoso**:
   ```
   ✅ Deployment complete! Listening on port 80
   ```

3. **Supervisor ejecutando servicios**:
   - PHP-FPM ✓
   - Nginx ✓
   - Queue workers (x2) ✓
   - Scheduler ✓

---

## 📊 Diferencias Docker Local vs Coolify

| Aspecto | Docker Compose (Local) | Coolify |
|---------|----------------------|---------|
| **Build** | docker-compose.yml | Dockerfile directo |
| **Puerto** | 8080:80 | Dinámico (80 → 3000) |
| **Variables** | Archivo `.env` | UI de Coolify |
| **MySQL** | Incluido en compose | Servicio separado |
| **Redis** | Incluido en compose | Servicio separado |

---

## 🎯 Checklist de Despliegue

- [ ] Cambiar Build Pack a "Dockerfile" en Coolify
- [ ] Corregir permisos en el servidor (`fix-coolify-permissions.sh`)
- [ ] Configurar todas las variables de entorno
- [ ] Añadir servicios MySQL y Redis
- [ ] Configurar volúmenes para storage
- [ ] Generar y configurar APP_KEY
- [ ] Probar health check después del deploy

---

## 📞 Soporte

Si persisten problemas:

1. **Revisa logs detallados**: Coolify → Show Debug Logs
2. **Verifica el servidor**: 
   ```bash
   sudo systemctl status coolify
   sudo journalctl -u coolify -n 100
   ```
3. **Documentación oficial**: https://coolify.io/docs

---

**🎉 Una vez configurado correctamente, los despliegues futuros serán automáticos con cada push a GitHub!**
