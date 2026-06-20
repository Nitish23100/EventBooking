import Booking from '../models/Booking.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/async-handler.js';

export const checkBookingOwnership = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const booking = await Booking.findById(id);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  // Verify that the booking belongs to the currently logged in user
  if (booking.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You do not have permission to access or cancel this booking');
  }

  req.booking = booking;
  next();
});
