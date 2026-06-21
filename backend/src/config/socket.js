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
    // Regex to validate a 24-character hex MongoDB ObjectId
    const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
    // Maximum number of event rooms a single socket may join
    const MAX_ROOMS = 5;

    socket.on('joinEvent', (eventId) => {
      // Reject anything that isn't a valid ObjectId — prevents arbitrary
      // room name injection and room flooding via crafted strings.
      if (typeof eventId !== 'string' || !OBJECT_ID_REGEX.test(eventId)) {
        return; // Silently drop invalid join attempts
      }

      // Enforce per-socket room cap (socket.rooms always includes its own id)
      if (socket.rooms.size >= MAX_ROOMS + 1) {
        return; // Silently drop once the cap is reached
      }

      socket.join(`event:${eventId}`);
    });

    socket.on('leaveEvent', (eventId) => {
      // Validate before leaving too — prevents leaking room names via errors
      if (typeof eventId !== 'string' || !OBJECT_ID_REGEX.test(eventId)) {
        return;
      }
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
