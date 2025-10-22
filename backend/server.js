const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001; 

const productos = require('./productos.json');

app.use(cors());
app.use(express.json()); 

// --- ruta de productos ---
app.get('/api/productos', (req, res) => {
  res.json(productos);
});


// --- ruta de registro ---
app.post('/api/register', (req, res) => {

  const { nombre, email, password } = req.body;

  console.log("Datos de registro recibidos:");
  console.log({ nombre, email, password });

  res.status(201).json({ message: `¡Usuario ${nombre} registrado con éxito!` });
});

// --- ruta del login --
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  console.log("Datos de login recibidos:");
  console.log({ email, password });

  res.status(200).json({ message: `¡Bienvenido de vuelta, ${email}!` });
});

app.listen(port, () => {
  console.log(`Servidor de API corriendo en http://localhost:${port}`);
});