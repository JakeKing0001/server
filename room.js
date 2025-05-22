// server/room.js
const { v4: uuidv4 } = require('uuid');

const rooms = {};
let io = null;

/**
 * Inizializza il modulo passando l'istanza di Socket.IO
 */
function initialize(socketIo) {
  io = socketIo;
}

/**
 * Crea una nuova stanza di gioco e assegna Bianco al creatore
 */
function createGame(socket, playerName) {
  const roomId = uuidv4();
  rooms[roomId] = {
    id: roomId,
    players: [{ name: playerName, socketId: socket.id, color: 'white' }],
    spectators: []
  };
  socket.join(roomId);
  socket.emit('gameCreated', roomId);
}

/**
 * Unisce un utente esistente a una stanza: se c'è spazio, lo fa giocatore Nero,
 * altrimenti spettatore passivo.
 */
function joinGame(socket, roomId, playerName) {
  const room = rooms[roomId];
  if (!room) {
    socket.emit('error', 'Room non trovata');
    return;
  }
  if (room.players.length < 2) {
    const color = room.players[0].color === 'white' ? 'black' : 'white';
    room.players.push({ name: playerName, socketId: socket.id, color });
    socket.join(roomId);
    io.to(roomId).emit('startGame', { roomId, players: room.players });
  } else {
    room.spectators.push({ name: playerName, socketId: socket.id });
    socket.join(roomId);
    socket.emit('spectatorJoined', roomId);
  }
}

/**
 * Riceve da un giocatore una mossa e la inoltra agli altri nella stanza.
 */
function handleMove(socket, { roomId, move }) {
  socket.to(roomId).emit('move', move);
}

/**
 * Pulisce la stanza rimuovendo giocatore o spettatore
 */
function leaveRoom(socketId) {
  for (const roomId in rooms) {
    const room = rooms[roomId];
    // Rimuovi dai giocatori
    const pIndex = room.players.findIndex(p => p.socketId === socketId);
    if (pIndex !== -1) {
      room.players.splice(pIndex, 1);
      if (room.players.length === 0) delete rooms[roomId];
      return;
    }
    // Rimuovi dagli spettatori
    const sIndex = room.spectators.findIndex(s => s.socketId === socketId);
    if (sIndex !== -1) {
      room.spectators.splice(sIndex, 1);
      return;
    }
  }
}

/**
 * Handler wrapper per la disconnessione del socket
 */
function handleDisconnect(socket) {
  leaveRoom(socket.id);
}

module.exports = {
  initialize,
  createGame,
  joinGame,
  handleMove,
  handleDisconnect,
  rooms
};
