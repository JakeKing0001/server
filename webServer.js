const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 3210 });

server.on('connection', socket => {
    console.log('✅ Client connesso');
    socket.send('Benvenuto!');

    socket.on('message', message => {
        console.log('📨 Messaggio ricevuto:', message);
        socket.send('Echo: ' + message);
    });

    socket.on('close', () => console.log('❌ Client disconnesso'));
    socket.on('error', err => console.error('⚠️ Errore:', err));
});

console.log('WebSocket server in ascolto');
