import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      lowercase: true,
      default: 'general',
      trim: true,
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats capacity is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Available seats count is required'],
      min: [0, 'Available seats cannot be negative'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Define indexes as planned
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ category: 1, date: 1, availableSeats: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
