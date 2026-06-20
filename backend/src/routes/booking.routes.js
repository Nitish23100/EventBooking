import express from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.js';
import { createBookingValidator } from '../validators/booking.validator.js';
import { checkBookingOwnership } from '../middleware/ownership.js';
import * as bookingController from '../controllers/booking.controller.js';

const router = express.Router();

// All booking routes are protected
router.use(requireAuth);

router.post('/', validate(createBookingValidator), bookingController.createBooking);
router.get('/me', bookingController.getUserBookings);
router.delete('/:id', checkBookingOwnership, bookingController.cancelBooking);

export default router;
