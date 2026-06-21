import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

let socketInstance = null;

export const useSocket = () => {
  const socketRef = useRef(null);

  if (!socketInstance) {
    const socketUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : undefined;
    socketInstance = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
  }

  socketRef.current = socketInstance;

  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected to server');
    };

    const onDisconnect = () => {
      console.log('Socket disconnected from server');
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('disconnect', onDisconnect);

    return () => {
      socketInstance.off('connect', onConnect);
      socketInstance.off('disconnect', onDisconnect);
    };
  }, []);

  const joinEvent = (eventId) => {
    if (socketInstance && eventId) {
      socketInstance.emit('joinEvent', eventId);
    }
  };

  const leaveEvent = (eventId) => {
    if (socketInstance && eventId) {
      socketInstance.emit('leaveEvent', eventId);
    }
  };

  return {
    socket: socketInstance,
    joinEvent,
    leaveEvent,
  };
};

export default useSocket;
