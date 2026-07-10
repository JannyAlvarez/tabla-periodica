const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Tipos MIME comunes
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  // Ruta por defecto
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);

  // Prevenir acceso fuera del directorio
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Acceso denegado');
    return;
  }

  // Servir archivo
  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Archivo no encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error del servidor');
      }
    } else {
      const ext = path.extname(filePath);
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║        ⚛️  TABLA PERIÓDICA - SERVIDOR INICIADO ⚛️        ║
╚═══════════════════════════════════════════════════════════╝

🚀 Servidor corriendo en: http://localhost:${PORT}

📱 Acceso desde otros dispositivos:
   - En la misma red: http://${getLocalIP()}:${PORT}

🎮 Abre tu navegador y ¡a jugar!

⌨️  Para detener: presiona CTRL + C
  `);
});

// Obtener IP local
function getLocalIP() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}
