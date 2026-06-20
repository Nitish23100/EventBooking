import { useState, useEffect, useCallback } from 'react';
import client from '../api/client.js';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get('/bookings/me');
      setBookings(response.data.data.bookings);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (eventId, seats) => {
    try {
      const response = await client.post('/bookings', { eventId, seats });
      const newBooking = response.data.data.booking;
      
      // Update local state by adding the new booking at the top
      setBookings((prev) => [newBooking, ...prev]);
      
      return { success: true, booking: newBooking };
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to create booking';
      return { success: false, error: errMsg };
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    try {
      const response = await client.delete(`/bookings/${bookingId}`);
      const updatedBooking = response.data.data.booking;
      
      // Update local state by swapping in the updated booking status
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
      
      return { success: true, booking: updatedBooking };
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Failed to cancel booking';
      return { success: false, error: errMsg };
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    cancelBooking,
  };
};

export default useBookings;
