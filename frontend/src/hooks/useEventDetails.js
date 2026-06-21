import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import client from '../api/client.js';
import useSocket from './useSocket.js';

export const useEventDetails = (eventId) => {
  const queryClient = useQueryClient();
  const { socket, joinEvent, leaveEvent } = useSocket();

  const eventQuery = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null;
      const response = await client.get(`/events/${eventId}`);
      return response.data.data.event;
    },
    enabled: !!eventId,
  });

  // WebSocket Subscription Lifecycle
  useEffect(() => {
    if (!eventId || !socket) return;

    // Join the room for this event
    joinEvent(eventId);

    // Listen for seat updates from the server
    const handleSeatUpdate = (data) => {
      if (data.eventId === eventId) {
        // Patch the cache
        queryClient.setQueryData(['event', eventId], (oldEvent) => {
          if (!oldEvent) return oldEvent;
          return {
            ...oldEvent,
            availableSeats: data.availableSeats,
          };
        });

        // Invalidate events cache to update lists
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
    };

    socket.on('seatUpdate', handleSeatUpdate);

    // Cleanup: Leave room and remove listener
    return () => {
      leaveEvent(eventId);
      socket.off('seatUpdate', handleSeatUpdate);
    };
  }, [eventId, socket, joinEvent, leaveEvent, queryClient]);

  return {
    event: eventQuery.data || null,
    loading: eventQuery.isLoading,
    error: eventQuery.error?.response?.data?.error || eventQuery.error?.message || null,
    refetch: eventQuery.refetch,
  };
};

export default useEventDetails;
