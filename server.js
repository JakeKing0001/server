const express = require("express");
const http = require("http");
const WebSocket = require("ws");

ws.on("connection", (ws) => {
  console.log("✅ Client connesso");

  ws.isAlive = true;
  ws.on("pong", () => (ws.isAlive = true));

  const interval = setInterval(() => {
    wss.clients.forEach((client) => {
      if (!client.isAlive) return client.terminate();
      client.isAlive = false;
      client.ping();
    });
  }, 30000); // Controlla ogni 30 secondi

  ws.on("message", (message) => {
    console.log("📩 Messaggio ricevuto:", message);
    wss.broadcast(`ECO: ${message}`);
  });

  ws.on("close", () => {
    clearInterval(interval);
    console.log("❌ Client disconnesso");
  });
});
