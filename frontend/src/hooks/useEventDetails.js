import { useState, useEffect, useCallback } from 'react';
import client from '../api/client.js';

export const useEventDetails = (eventId) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return {
    event,
    loading,
    error,
    refetch: fetchDetails,
  };
};
export default useEventDetails;
