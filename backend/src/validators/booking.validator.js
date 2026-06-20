import { z } from 'zod';

export const createBookingValidator = z.object({
  eventId: z
    .string({ required_error: 'Event ID is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid event ID'),
  seats: z
    .number({ required_error: 'Number of seats is required' })
    .int('Seats must be an integer')
    .min(1, 'Must book at least 1 seat')
    .max(10, 'Cannot book more than 10 seats'),
});
