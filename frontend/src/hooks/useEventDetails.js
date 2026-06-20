import { useState, useEffect, useCallback } from 'react';
import client from '../api/client.js';
import useSocket from './useSocket.js';

export const useEventDetails = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket, joinEvent, leaveEvent } = useSocket();

  const fetchDetails = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await client.get(`/events/${eventId}`);
      setEvent(response.data.data.event);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Initial HTTP Fetch
  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // WebSocket Subscription Lifecycle
  useEffect(() => {
    if (!eventId || !socket) return;

    // Join the room for this event
    joinEvent(eventId);

    // Listen for seat updates from the server
    const handleSeatUpdate = (data) => {
      if (data.eventId === eventId) {
        setEvent((prevEvent) => {
          if (!prevEvent) return null;
          return {
            ...prevEvent,
            availableSeats: data.availableSeats,
          };
        });
      }
    };

    socket.on('seatUpdate', handleSeatUpdate);

    // Cleanup: Leave room and remove listener
    return () => {
      leaveEvent(eventId);
      socket.off('seatUpdate', handleSeatUpdate);
    };
  }, [eventId, socket, joinEvent, leaveEvent]);

  return {
    event,
    loading,
    error,
    refetch: fetchDetails,
  };
};

export default useEventDetails;
