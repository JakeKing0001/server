const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 3210;  // Usa la porta fornita da Render

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permette connessioni da qualsiasi dominio (modifica se necessario)
  }
});

io.on("connection", (socket) => {
  console.log("Un utente si è connesso:", socket.id);

  socket.on("disconnect", () => {
    console.log("Un utente si è disconnesso:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
