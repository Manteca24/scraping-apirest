/*¿Qué hace app.js?
Configura el servidor HTTP usando Express.
Define rutas CRUD para crear, leer, actualizar y eliminar noticias.
Lee y guarda noticias en un archivo JSON usando fs.*/

const express = require('express');
const fs = require('fs');
const scraping  = require('./scraping');  
const app = express();

let noticias = [];

// Middleware para manejar datos JSON y formularios URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Leer datos desde el archivo JSON
const leerDatos = () => {
  try {
    const data = fs.readFileSync('noticias.json', 'utf-8'); // leer el contenido de 'noticias.json'
    noticias = JSON.parse(data); // parsear el contenido en formato JSON a un objeto
  } catch (error) {
    console.error('Error al leer el archivo noticias.json:', error.message);
  }
}

// Guardar datos en el archivo JSON
const guardarDatos = () => {
  fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
}

// Ruta para realizar el scraping y guardar los datos
app.get('/scraping', async (req, res) => {
  await scraping(); // Llamada a la función de scraping
  leerDatos(); // Cargar los datos recién scrapados
  res.json({ message: 'Scraping completado y datos guardados en noticias.json' });
});

// Ruta para obtener todas las noticias
app.get('/noticias', (req, res) => {
  leerDatos();
  res.json(noticias);
});

// Ruta para obtener una noticia por índice
app.get('/noticias/:index', (req, res) => {
  leerDatos();
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < noticias.length) {
    res.json(noticias[index]);
  } else {
    res.status(404).send('Noticia no encontrada');
  }
});

// Ruta para crear una nueva noticia
app.post('/noticias', (req, res) => {
  const { titulo, imagen, descripcion, enlace } = req.body;
  const nuevaNoticia = { titulo, imagen, descripcion, enlace };
  leerDatos(); 
  noticias.push(nuevaNoticia);
  guardarDatos();

  res.status(201).json({ message: 'Noticia creada con éxito', noticia: nuevaNoticia });
});

// Ruta para actualizar una noticia existente por índice
app.put('/noticias/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < noticias.length) {
    noticias[index] = req.body;
    guardarDatos();
    res.send('Noticia actualizada');
  } else {
    res.status(404).send('Noticia no encontrada');
  }
});

// Ruta para eliminar una noticia por índice
app.delete('/noticias/:index', (req, res) => {
  const index = parseInt(req.params.index, 10);
  if (index >= 0 && index < noticias.length) {
    noticias.splice(index, 1);
    guardarDatos();
    res.send('Noticia eliminada');
  } else {
    res.status(404).send('Noticia no encontrada');
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
