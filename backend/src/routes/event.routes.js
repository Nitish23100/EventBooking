import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { getEvents, getEventById, searchEvents } from '../controllers/event.controller.js';
import validate from '../middleware/validate.js';
import { searchEventsSchema } from '../validators/event.validator.js';

const router = Router();

// Rate limiter: 10 requests per 15 minutes per IP (Groq API cost protection)
const aiSearchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many AI search requests from this IP, please try again after 15 minutes.',
  },
});

router.post('/search', aiSearchLimiter, validate(searchEventsSchema), searchEvents);
router.get('/', getEvents);
router.get('/:id', getEventById);

export default router;
