// server/index.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const room = require('./room');

const app = express();

// Se servite anche il build React, ad esempio:
// app.use(express.static(path.join(__dirname, '../client/build')));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Collega Socket.IO al modulo room
room.initialize(io);

io.on('connection', (socket) => {
  console.log('🔌 Nuova connessione:', socket.id);

  // Creazione nuova partita
  socket.on('createGame', (playerName) => {
    room.createGame(socket, playerName);
  });

  // Join a partita esistente
  socket.on('joinGame', (roomId, playerName) => {
    room.joinGame(socket, roomId, playerName);
  });

  // Forward delle mosse
  socket.on('move', (data) => {
    room.handleMove(socket, data);
  });

  // Disconnessione
  socket.on('disconnect', () => {
    console.log('❌ Disconnessione:', socket.id);
    room.handleDisconnect(socket);
  });
});


const PORT = parseINT(process.env.PORT, 10) || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
});
