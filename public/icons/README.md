# Generación de Iconos PWA

Los iconos para la PWA deben generarse en los siguientes tamaños:

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192 (requerido para Android)
- 384x384
- 512x512 (requerido para Android)

## Opción 1: Usando un servicio online

1. Visita https://realfavicongenerator.net/
2. Sube el archivo `icon.svg` de esta carpeta
3. Descarga el paquete de iconos generado
4. Extrae los archivos en esta carpeta `/public/icons/`

## Opción 2: Usando ImageMagick (línea de comandos)

```bash
# Instalar ImageMagick si no lo tienes
sudo apt-get install imagemagick

# Generar todos los tamaños
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

## Opción 3: Generar con Node.js

```bash
npm install -g pwa-asset-generator

pwa-asset-generator icon.svg ./public/icons \
  --icon-only \
  --favicon \
  --type png \
  --path-override /icons
```

## Temporal

Mientras tanto, el sistema funcionará con el SVG base. Para producción, es recomendable generar los PNG en todos los tamaños especificados.
