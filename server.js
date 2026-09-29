const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT ||3000;

app.use(cors());
app.use(express.json());

//uso de endpoint de prueba para verificar el servidor responda correctamente
app.get('/api/productos', async (req, res)=>{
    try{
        const productos = await prisma.producto.findMany();
        res.json(productos);
    } catch (error){
        console.error('Error al obtener productos', error);
        res.status(500).json({ error: 'Error interno del servidor'});
    }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});