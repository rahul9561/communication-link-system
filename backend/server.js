import http from 'http';
import { handleRequest } from './services/linkService.js';
import { initWebSocket } from './wsServer.js';

const server = http.createServer((req, res) => {
  // 🧩 Handle CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // or specific domain: 'http://localhost:5173'
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🧩 Handle preflight (OPTIONS) requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  // 🧩 Continue to your request handler
  handleRequest(req, res);
});

initWebSocket(server); // Attach WebSocket to the same server

const PORT = 3000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
