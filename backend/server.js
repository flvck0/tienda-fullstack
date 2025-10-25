const express = require('express');
const cors = require('cors');

const app = express();
const productos = require('./productos.json');

app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/productos', (req, res) => res.json(productos));

app.post('/api/register', (req, res) => {
  const { nombre, email, password } = req.body;
  console.log("Datos de registro recibidos:", { nombre, email, password });
  res.status(201).json({ message: `¡Usuario ${nombre} registrado con éxito!` });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("Datos de login recibidos:", { email, password });
  res.status(200).json({ message: `¡Bienvenido de vuelta, ${email}!` });
});

module.exports = app; // 👈 Exporta solo el app
