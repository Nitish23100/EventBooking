import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from '../api/client.js';

export const useBookings = () => {
  const queryClient = useQueryClient();

  // Fetch user bookings
  const bookingsQuery = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await client.get('/bookings/me');
      return response.data.data.bookings;
    },
  });

  // Mutation: Create Booking
  const createBookingMutation = useMutation({
    mutationFn: async ({ eventId, seats }) => {
      const response = await client.post('/bookings', { eventId, seats });
      return response.data.data.booking;
    },
    onSuccess: (newBooking) => {
      // Invalidate bookings
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Invalidate all events list
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      const eventId = newBooking.event?._id || newBooking.event;
      if (eventId) {
        // Invalidate details of the specific event
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
    },
  });

  // Mutation: Cancel Booking
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId) => {
      const response = await client.delete(`/bookings/${bookingId}`);
      return response.data.data.booking;
    },
    onSuccess: (updatedBooking) => {
      // Invalidate bookings
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      // Invalidate all events list
      queryClient.invalidateQueries({ queryKey: ['events'] });
      
      const eventId = updatedBooking.event?._id || updatedBooking.event;
      if (eventId) {
        // Invalidate details of the specific event
        queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      }
    },
  });

  return {
    bookings: bookingsQuery.data || [],
    loading: bookingsQuery.isLoading,
    error: bookingsQuery.error?.response?.data?.error || bookingsQuery.error?.message || null,
    refetch: bookingsQuery.refetch,
    createBooking: async (eventId, seats) => {
      try {
        const booking = await createBookingMutation.mutateAsync({ eventId, seats });
        return { success: true, booking };
      } catch (err) {
        return { success: false, error: err.response?.data?.error || err.message };
      }
    },
    cancelBooking: async (bookingId) => {
      try {
        const booking = await cancelBookingMutation.mutateAsync(bookingId);
        return { success: true, booking };
      } catch (err) {
        return { success: false, error: err.response?.data?.error || err.message };
      }
    },
  };
};

export default useBookings;
