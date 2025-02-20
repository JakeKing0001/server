const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Aggiunge il metodo di broadcast all'istanza WebSocket
wss.broadcast = function (data) {
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Controllo della connessione ogni 30 secondi (una sola volta per tutti i client)
const interval = setInterval(() => {
  wss.clients.forEach((client) => {
    if (!client.isAlive) return client.terminate();
    client.isAlive = false;
    client.ping();
  });
}, 30000);

wss.on("connection", (ws) => {
  console.log("✅ Client connesso");

  ws.isAlive = true;
  ws.on("pong", () => (ws.isAlive = true));

  ws.on("message", (message) => {
    console.log("📩 Messaggio ricevuto:", message);
    wss.broadcast(`ECO: ${message}`);
  });

  ws.on("close", () => {
    console.log("❌ Client disconnesso");
  });
});

wss.on("listening", () => {
  console.log(`🚀 WebSocket server in ascolto sulla porta ${PORT}`);
});

server.listen(PORT, () => {
  console.log(`🚀 Server HTTP in ascolto sulla porta ${PORT}`);
});

// Pulisce l'intervallo quando il server viene chiuso
server.on("close", () => clearInterval(interval));
