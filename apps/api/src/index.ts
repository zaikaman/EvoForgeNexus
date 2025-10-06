/**
 * EvoForge Nexus API Server
 * Real-time evolution streaming with WebSocket
 */

import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { evolutionRouter } from './routes/evolution.js';
import { agentsRouter } from './routes/agents.js';
import { getApiKeyStatus } from '../../../src/utils/llm-wrapper.js';

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.API_PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'evoforge-nexus-api',
    version: '0.1.0',
    timestamp: Date.now(),
  });
});

// API key status endpoint
app.get('/api/keys/status', (req, res) => {
  const status = getApiKeyStatus();
  res.json({
    ...status,
    healthy: status.available > 0,
    utilizationRate: ((status.total - status.available) / status.total * 100).toFixed(1) + '%',
  });
});

// API Routes
app.use('/api/evolution', evolutionRouter);
app.use('/api/agents', agentsRouter);

// WebSocket connection handling
wss.on('connection', (ws: WebSocket) => {
  console.log('🔌 WebSocket client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to EvoForge Nexus evolution stream',
    timestamp: Date.now(),
  }));

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('📨 Received:', data);
      
      // Handle different message types
      switch (data.type) {
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          break;
        case 'subscribe':
          // Subscribe to evolution events
          ws.send(JSON.stringify({ 
            type: 'subscribed', 
            evolutionId: data.evolutionId,
            timestamp: Date.now(),
          }));
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// Broadcast to all connected clients
export function broadcast(data: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Start server
server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🌟 EVOFORGE NEXUS API');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✅ HTTP Server: http://localhost:${PORT}`);
  console.log(`✅ WebSocket: ws://localhost:${PORT}`);
  console.log('═══════════════════════════════════════════════════════\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
