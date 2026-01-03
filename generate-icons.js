/**
 * Script para generar iconos PWA en diferentes tamaños
 * 
 * Uso:
 * npm install sharp
 * node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// Crear iconos placeholder básicos (1x1 pixel transparente)
// En producción, deberías reemplazar estos con iconos reales

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const createPlaceholderPNG = (size) => {
  // PNG transparente 1x1 pixel (base64)
  const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  return Buffer.from(base64PNG, 'base64');
};

const iconsDir = path.join(__dirname, 'public', 'icons');

// Crear directorio si no existe
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Generando iconos placeholder...');

sizes.forEach(size => {
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  
  // Solo crear si no existe
  if (!fs.existsSync(filepath)) {
    const placeholder = createPlaceholderPNG(size);
    fs.writeFileSync(filepath, placeholder);
    console.log(`✓ Creado: ${filename}`);
  } else {
    console.log(`- Ya existe: ${filename}`);
  }
});

console.log('\n✅ Iconos generados!');
console.log('\n⚠️  IMPORTANTE: Estos son placeholders. Para producción:');
console.log('   1. Diseña un icono de 512x512px');
console.log('   2. Usa https://realfavicongenerator.net/ para generar todos los tamaños');
console.log('   3. Reemplaza los archivos en public/icons/\n');
