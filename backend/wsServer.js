import { WebSocketServer } from 'ws';

let wss;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });
  wss.on('connection', ws => {
    console.log('Client connected');
    ws.send(JSON.stringify({ message: 'Welcome to Realtime Updates!' }));
  });
}

export function broadcast(data) {
  if (!wss) return;
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}
