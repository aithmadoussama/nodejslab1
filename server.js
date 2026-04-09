const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  if (path === '/api/users') {
    fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Erreur serveur'}));
        return;
      }
      
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(data);
    });
  } 
  else if (path.match(/^\/api\/users\/\d+$/)) {
    const id = parseInt(path.split('/')[3]);
    
    fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Erreur serveur'}));
        return;
      }
      
      const users = JSON.parse(data);
      const user = users.find(u => u.id === id);
      
      if (user) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(user));
      } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({error: 'Utilisateur non trouvé'}));
      }
    });
  }
  else if (path === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(`
      <h1>API de démonstration</h1>
      <p>Essayez les routes suivantes:

      <ul>
        <li><a href="/api/users">/api/users</a> - Tous les utilisateurs</li>
        <li><a href="/api/users/1">/api/users/1</a> - Utilisateur avec ID 1</li>
      </ul>
    `);
  }
  else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end('<h1>404 - Page non trouvée</h1>');
  }
});

server.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});