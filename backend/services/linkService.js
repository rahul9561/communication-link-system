import { db } from '../db.js';
import { broadcast } from '../wsServer.js';

export async function handleRequest(req, res) {
  if (req.method === 'GET' && req.url === '/links') {
    const [rows] = await db.query('SELECT * FROM links');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(rows));
  } 
  else if (req.method === 'POST' && req.url === '/links') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      const { name, status } = JSON.parse(body);
      await db.query('INSERT INTO links (name, status) VALUES (?, ?)', [name, status]);
      broadcast({ type: 'NEW_LINK', name, status });
      res.writeHead(201);
      res.end('Link created');
    });
  }
  else {
    res.writeHead(404);
    res.end('Not found');
  }
}
