import { Router } from 'express';
import { getEvents, getEventById, searchEvents } from '../controllers/event.controller.js';
import validate from '../middleware/validate.js';
import { searchEventsSchema } from '../validators/event.validator.js';

const router = Router();

router.post('/search', validate(searchEventsSchema), searchEvents);
router.get('/', getEvents);
router.get('/:id', getEventById);

export default router;
