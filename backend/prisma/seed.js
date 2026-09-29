const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const jsonPath = path.join(__dirname, '../../data/tienda.json');
  console.log('1. Buscando archivo en:', jsonPath);

  if (!fs.existsSync(jsonPath)) {
    console.error('❌ ERROR: No se encontró el archivo tienda.json');
    return;
  }

  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const productos = JSON.parse(rawData);

  console.log(`2. Se encontraron ${productos.length} productos en el JSON.`);

  for (const prod of productos) {
    const nuevo = await prisma.producto.create({
      data: {
        nombre: prod.nombre,
        precio: parseFloat(prod.precio),
        imagen: prod.imagen || '',
        categoria: prod.categoria || 'General',
        marca: prod.marca || null,
        stock: prod.stock || 10
      }
    });
    console.log(`✅ Creado: ${nuevo.nombre} (ID: ${nuevo.id})`);
  }

  console.log('3. ¡Carga de datos finalizada!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la inserción:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });