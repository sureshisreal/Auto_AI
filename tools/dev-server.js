const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const projectRoot = path.resolve(__dirname, '..');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const routes = {
  '/': 'demo/index.html',
  '/login': 'demo/login.html',
  '/dashboard': 'demo/dashboard.html'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  if (urlPath === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), 'utf-8');
    return;
  }

  const routedFile = routes[urlPath];
  let filePath = path.join(projectRoot, routedFile || urlPath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code, 'utf-8');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://127.0.0.1:${PORT}/`);
});
