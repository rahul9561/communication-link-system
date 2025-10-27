export const initWebSocket = (onMessage) => {
  const ws = new WebSocket("ws://localhost:3000");
  ws.onmessage = (event) => onMessage(JSON.parse(event.data));
  return ws;
};
