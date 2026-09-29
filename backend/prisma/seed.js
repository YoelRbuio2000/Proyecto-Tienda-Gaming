const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productos = [
  {
    nombre: "PC GAMING 'AETERNUM'",
    precio: 3000,
    imagen: "assets/pc_fondo_azul.jpeg", // o .webp si ya las convertiste
    categoria: "Combos Gaming"
  },
  {
    nombre: "NVIDIA RTX 4080 Super",
    precio: 1300,
    imagen: "assets/Grafica_RTX_4090.jpg",
    categoria: "Placas de Video"
  },
  {
    nombre: "AMD RYZEN 9 9900X",
    precio: 500,
    imagen: "assets/AMD RYZEN 9 9900X.jpg",
    categoria: "Procesadores"
  }
  // Agrega aquí el resto de tus productos
];

async function main() {
  console.log("Cargando productos en la base de datos...");
  for (const prod of productos) {
    await prisma.producto.create({ data: prod });
  }
  console.log("¡Productos cargados con éxito!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());