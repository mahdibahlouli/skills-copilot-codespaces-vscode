// Create web server
// http://localhost:3000/comments
// http://localhost:3000/comments/1
// http://localhost:3000/comments/2
// http://localhost:3000/comments/3

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const { url, method } = req;
  const path = url.split('/');
  const id = path[2];
  if (url === '/comments' && method === 'GET') {
    fs.readFile('comments.json', 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
      }
    });
  } else if (url === '/comments' && method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const data = JSON.parse(body);
      fs.readFile('comments.json', 'utf8', (err, fileData) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal server error' }));
        } else {
          const comments = JSON.parse(fileData);
          comments.push(data);
          fs.writeFile('comments.json', JSON.stringify(comments), (err) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal server error' }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
            }
          });
        }
      });
    });
  } else if (url === '/comments' && method === 'DELETE') {
    fs.writeFile('comments.json', '[]', (err) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      } else {
                res.writeHead(204, { 'Content-Type': 'application/json' });
                res.end();
              }
            });
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
          }
        });
        
        server.listen(3000, () => {
          console.log('Server is listening on port 3000');
        });

