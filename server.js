const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast to all clients
wss.broadcast = (data) => wss.clients.forEach((client) => client.readyState === WebSocket.OPEN && client.send(data));

wss.on("connection", (ws) => {
  console.log("✅ Client connesso");

  ws.on("message", (message) => {
    console.log("📩 Messaggio ricevuto:", message);
    wss.broadcast(`ECO: ${message}`);
  });

  ws.on("close", () => console.log("❌ Client disconnesso"));
});

server.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su ${PORT}`);
});