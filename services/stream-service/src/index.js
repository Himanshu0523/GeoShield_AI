import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.STREAM_SERVICE_PORT || 8005;

io.on('connection', (socket) => {
  console.log(`⚡ Client connected to GeoShield Stream Telemetry: ${socket.id}`);

  // Send initial telemetry handshake
  socket.emit('system:health', {
    api: 'healthy',
    socket: 'connected',
    feeds: 'online',
    timestamp: new Date().toISOString()
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Periodic mock telemetric broadcast emitting spatial risk updates every 15 seconds
setInterval(() => {
  const mockRiskUpdate = {
    regionId: 'REG-01',
    score: Number((0.75 + Math.random() * 0.15).toFixed(3)),
    risk_level: 'CRITICAL',
    rainfall_24h_mm: Number((110 + Math.random() * 20).toFixed(1)),
    timestamp: new Date().toISOString()
  };

  io.emit('region:risk-updated', mockRiskUpdate);
  io.emit('system:health', {
    api: 'healthy',
    socket: 'connected',
    feeds: 'online',
    timestamp: new Date().toISOString()
  });
}, 15000);

httpServer.listen(PORT, () => {
  console.log(`📡 WebSocket Stream Service listening on port ${PORT}`);
});
