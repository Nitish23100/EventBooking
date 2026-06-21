import Event from '../models/Event.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/async-handler.js';
import { semanticSearch } from '../services/ai-search.service.js';

export const getEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 12;
  const category = req.query.category;
  const search = req.query.search;

  const query = {};

  // Filter by category (if it is not 'all')
  if (category && category !== 'all') {
    query.category = category.toLowerCase();
  }

  // Filter by search query (name or description matching regex)
  // escapeRegex prevents ReDoS by treating user input as a literal string,
  // not as regex syntax.
  if (search) {
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapeRegex(search.trim()), 'i');
    query.$or = [
      { name: regex },
      { description: regex }
    ];
  }

  const skip = (page - 1) * limit;

  // Fetch events sorted by date (ascending)
  const events = await Event.find(query)
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit);

  const total = await Event.countDocuments(query);

  res.status(200).json({
    success: true,
    message: 'Events retrieved successfully',
    data: {
      events,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    }
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  res.status(200).json({
    success: true,
    message: 'Event retrieved successfully',
    data: {
      event
    }
  });
});

export const searchEvents = asyncHandler(async (req, res) => {
  const { query } = req.body;
  const result = await semanticSearch(query);

  res.status(200).json({
    success: true,
    message: 'AI Search completed successfully',
    data: result
  });
});
