/*¿Qué hace scraping.js?
Hacer una solicitud HTTP con axios: Obtenemos el HTML de la página de El País.
Analizar el HTML con cheerio: Usamos Cheerio para seleccionar y extraer elementos específicos del HTML, 
como títulos, descripciones, imágenes y enlaces de las noticias.
Guardar los datos en un archivo JSON usando fs: Almacenamos las noticias extraídas en un archivo llamado noticias.json.*/ 

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://elpais.com/ultimas-noticias/';

const scraping = async () => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    let noticias = [];

    $("article.c.c-d.c--m").each((i, elemento) => {
      const titulo = $(elemento).find('h2.c_t').text().trim();
      const imagen = $(elemento).find('img').attr('src');
      const descripcion = $(elemento).find('p.c_d').text().trim();
      const enlace = $(elemento).find('a').attr("href");

      const noticia = {
        titulo,
        imagen,
        descripcion,
        enlace, 
      };

      noticias.push(noticia);
    });

    // Guardar las noticias en un archivo JSON
    fs.writeFileSync('noticias.json', JSON.stringify(noticias, null, 2));
    console.log('Scraping completado y datos guardados en noticias.json');
  } catch (error) {
    console.error(`El error es: ${error.message}`);
  }
};

module.exports = scraping;
