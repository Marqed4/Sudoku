import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { SessionManager } from './managers/SessionManager.js';
import { WebSocketManager } from './managers/WebSocketManager.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { 
    origin: [
      'https://solvesudoku.marqed.it',
      'https://sudoku-production.up.railway.app',
      'http://localhost:2001'
    ],
    methods: ['GET', 'POST']
  }
});

const PORT = 2002
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})