# Progressive Web App (PWA) - StyleCore

La aplicación StyleCore ahora es instalable como PWA, proporcionando una experiencia similar a una aplicación nativa.

## ✨ Características Implementadas

### 🚀 Instalación
- **Banner de instalación automático**: Aparece cuando el navegador detecta que la app es instalable
- **Compatible con todos los dispositivos**: Desktop, Android, iOS
- **Acceso rápido**: Icono en pantalla de inicio y launcher de apps

### 📱 Funcionalidad Offline
- **Service Worker**: Cachea recursos esenciales para acceso offline
- **Página offline personalizada**: Experiencia elegante cuando no hay conexión
- **Actualizaciones automáticas**: El service worker se actualiza en segundo plano

### 🎨 Experiencia Nativa
- **Pantalla completa**: Se ejecuta sin la barra de navegación del navegador
- **Tema personalizado**: Colores que coinciden con el diseño de la app
- **Atajos de teclado**: Acceso rápido a funciones clave desde el launcher

## 📂 Archivos Clave

### Configuración
- `/public/manifest.json` - Configuración de la PWA (nombre, iconos, colores)
- `/public/sw.js` - Service Worker (caché y offline)
- `/public/offline.html` - Página mostrada cuando no hay conexión

### Iconos
- `/public/icons/` - Iconos en diferentes tamaños (72px hasta 512px)
- `/public/icons/icon.svg` - Icono vectorial fuente

### Código
- `/resources/js/app.tsx` - Registro del Service Worker
- `/resources/js/components/pwa-install-banner.tsx` - Banner de instalación
- `/resources/views/app.blade.php` - Meta tags PWA

## 🔧 Configuración

### Personalizar Manifest
Edita `/public/manifest.json` para cambiar:
- Nombre de la app (`name`, `short_name`)
- Colores del tema (`theme_color`, `background_color`)
- Atajos rápidos (`shortcuts`)
- Descripción y categorías

### Personalizar Service Worker
Edita `/public/sw.js` para ajustar:
- Estrategia de caché (Network First, Cache First, etc.)
- Archivos a cachear
- Versión del cache (incrementa para forzar actualización)

### Personalizar Iconos
1. Diseña un icono cuadrado de 512x512px
2. Usa una herramienta como [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Genera todos los tamaños necesarios
4. Reemplaza los archivos en `/public/icons/`

## 📱 Cómo Instalar

### Android (Chrome/Edge)
1. Abre la app en Chrome o Edge
2. Aparecerá un banner de instalación en la parte inferior
3. Toca "Instalar" o usa el menú (⋮) > "Instalar app"

### iOS (Safari)
1. Abre la app en Safari
2. Toca el botón de compartir (⬆️)
3. Selecciona "Añadir a pantalla de inicio"
4. Confirma el nombre y toca "Añadir"

### Desktop (Chrome/Edge)
1. Abre la app en Chrome o Edge
2. Busca el ícono ➕ en la barra de direcciones
3. Clic en "Instalar StyleCore"
4. La app se abrirá en su propia ventana

## 🔍 Verificar Instalación

### Chrome DevTools
1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. En el menú lateral:
   - **Manifest**: Verifica configuración
   - **Service Workers**: Estado del SW
   - **Cache Storage**: Archivos cacheados

### Lighthouse
1. Abre DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Marca "Progressive Web App"
4. Ejecuta el análisis

## 🎯 Mejores Prácticas

### Icons
- ✅ **Obligatorio**: 192x192 y 512x512 para Android
- ✅ **Recomendado**: Iconos "maskable" para adaptarse a diferentes formas
- ✅ **Apple**: 180x180 para iOS (apple-touch-icon)

### Manifest
- ✅ Usar `"display": "standalone"` para experiencia de app nativa
- ✅ Definir `theme_color` que coincida con el header
- ✅ Proporcionar `shortcuts` para acciones comunes

### Service Worker
- ⚠️ **Actualizar versión** al cambiar archivos cacheados
- ⚠️ **Cachear solo lo necesario** para no consumir espacio
- ⚠️ **Estrategia Network First** para contenido dinámico

### Testing
- 🧪 Probar en múltiples dispositivos (Android, iOS, Desktop)
- 🧪 Probar modo offline (DevTools > Network > Offline)
- 🧪 Verificar que las actualizaciones funcionan correctamente

## 🚀 Despliegue

### Requisitos
1. **HTTPS obligatorio** (excepto localhost)
2. Service Worker debe servirse desde la raíz o con scope correcto
3. Manifest.json debe ser accesible públicamente

### Checklist Pre-Producción
- [ ] Reemplazar iconos placeholder con iconos de producción
- [ ] Agregar screenshots de la app al manifest
- [ ] Configurar correctamente `start_url` y `scope`
- [ ] Verificar que el sitio funcione 100% en HTTPS
- [ ] Probar instalación en todos los navegadores objetivo
- [ ] Verificar que el Service Worker se actualiza correctamente

## 🐛 Troubleshooting

### La app no se puede instalar
- Verifica que estés en HTTPS (no HTTP)
- Revisa que el manifest.json sea válido
- Asegúrate de tener iconos de 192x192 y 512x512

### El Service Worker no se registra
- Verifica la consola del navegador para errores
- Asegúrate de que `/sw.js` sea accesible
- Confirma que el SW no esté bloqueado por CORS

### Los cambios no se reflejan
- Incrementa `CACHE_VERSION` en `sw.js`
- Desregistra el SW anterior en DevTools
- Limpia el cache del navegador

### El banner de instalación no aparece
- El usuario puede haberlo rechazado antes
- Verifica `localStorage.getItem('pwa-install-dismissed')`
- El navegador puede tener criterios adicionales

## 📚 Recursos

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [Chrome Developers - Install Criteria](https://developer.chrome.com/docs/devtools/progressive-web-apps/)
- [iOS PWA Guide](https://web.dev/articles/apple-touch-icon)

## 💡 Mejoras Futuras

- [ ] Notificaciones Push
- [ ] Sincronización en segundo plano
- [ ] Compartir contenido nativo
- [ ] Acceso a archivos del sistema
- [ ] Badging API para notificaciones
- [ ] Shortcuts dinámicos basados en uso
