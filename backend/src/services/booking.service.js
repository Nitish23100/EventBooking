import Booking from '../models/Booking.js';
import Event from '../models/Event.js';
import ApiError from '../utils/ApiError.js';
import { getIO } from '../config/socket.js';

export const createBooking = async (userId, eventId, seats) => {
  // 1. Retrieve event details
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // 2. Block bookings for past events
  if (new Date(event.date) < new Date()) {
    throw new ApiError(400, 'Cannot book seats for a past event');
  }

  // 3. Perform atomic available seats decrement
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventId, availableSeats: { $gte: seats } },
    { $inc: { availableSeats: -seats } },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(409, 'Not enough seats available');
  }

  // 4. Create the booking document
  const booking = await Booking.create({
    user: userId,
    event: eventId,
    seats,
    status: 'confirmed',
  });

  // 5. Emit real-time seat update via Socket.IO if active
  const io = getIO();
  if (io) {
    io.to(`event:${eventId}`).emit('seatUpdate', {
      eventId,
      availableSeats: updatedEvent.availableSeats,
    });
  }

  // Populate event details before returning
  return await Booking.findById(booking._id).populate('event');
};

export const cancelBooking = async (bookingId, userId) => {
  // 1. Retrieve the booking (already verified owned in middleware, but safe check)
  const booking = await Booking.findById(bookingId).populate('event');
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.status === 'cancelled') {
    throw new ApiError(400, 'Booking is already cancelled');
  }

  // 2. Verify event has not passed
  if (new Date(booking.event.date) < new Date()) {
    throw new ApiError(400, 'Cannot cancel a booking for a past event');
  }

  // 3. Atomically restore seats on Event
  const updatedEvent = await Event.findByIdAndUpdate(
    booking.event._id,
    { $inc: { availableSeats: booking.seats } },
    { new: true }
  );

  // 4. Mark booking status as cancelled
  booking.status = 'cancelled';
  await booking.save();

  // 5. Emit real-time seat update via Socket.IO if active
  const io = getIO();
  if (io && updatedEvent) {
    io.to(`event:${booking.event._id.toString()}`).emit('seatUpdate', {
      eventId: booking.event._id.toString(),
      availableSeats: updatedEvent.availableSeats,
    });
  }

  return booking;
};

export const getUserBookings = async (userId) => {
  return await Booking.find({ user: userId })
    .populate('event')
    .sort({ createdAt: -1 });
};
