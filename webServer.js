const WebSocket = require("ws");

const PORT = process.env.PORT || 3000; // Render fornisce una porta dinamica
const server = new WebSocket.Server({ port: PORT }, () => {
  console.log(`🔗 WebSocket Server avviato sulla porta ${PORT}`);
});

server.on("connection", (ws) => {
  console.log("✅ Un client si è connesso!");

  ws.on("message", (message) => {
    console.log("📩 Messaggio ricevuto:", message);
    
    // Invia il messaggio a tutti i client connessi
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`ECO: ${message}`);
      }
    });
  });

  ws.on("close", () => console.log("❌ Un client si è disconnesso"));
});
