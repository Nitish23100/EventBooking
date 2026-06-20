import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinEvent', (eventId) => {
      socket.join(`event:${eventId}`);
    });

    socket.on('leaveEvent', (eventId) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      // Clean up if necessary
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};
