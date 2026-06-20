import * as bookingService from '../services/booking.service.js';
import asyncHandler from '../utils/async-handler.js';

export const createBooking = asyncHandler(async (req, res) => {
  const { eventId, seats } = req.body;
  const userId = req.user._id;

  const booking = await bookingService.createBooking(userId, eventId, seats);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking,
    },
  });
});

export const cancelBooking = asyncHandler(async (req, res) => {
  const bookingId = req.booking._id; // Attached by checkBookingOwnership middleware
  const userId = req.user._id;

  const booking = await bookingService.cancelBooking(bookingId, userId);

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking,
    },
  });
});

export const getUserBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const bookings = await bookingService.getUserBookings(userId);

  res.status(200).json({
    success: true,
    message: 'User bookings retrieved successfully',
    data: {
      bookings,
    },
  });
});
