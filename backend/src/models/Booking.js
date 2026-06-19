import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event is required'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: [1, 'Must book at least 1 seat'],
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Define indexes as planned
bookingSchema.index({ user: 1 });
bookingSchema.index({ user: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
