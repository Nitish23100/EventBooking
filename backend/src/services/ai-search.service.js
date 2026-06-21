import Groq from 'groq-sdk';
import { env } from '../config/env.js';
import Event from '../models/Event.js';
import ApiError from '../utils/ApiError.js';

let groq;
if (env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: env.GROQ_API_KEY });
}

export const semanticSearch = async (queryText) => {
  if (!groq) {
    throw new ApiError(503, 'AI Search is currently unavailable (missing API key)');
  }

  const today = new Date().toISOString().split('T')[0];

  const systemPrompt = `You are an AI assistant that parses natural language event search queries into structured JSON filters.
Today's date is ${today}.
Extract the following optional fields from the user's query:
- "category": (string) one of: music, tech, sports, comedy, art, food, theater, workshop, conference, or null.
- "dateFrom": (string YYYY-MM-DD) start date of mentioned timeframe, or null.
- "dateTo": (string YYYY-MM-DD) end date of mentioned timeframe, or null.
- "keyword": (string) any specific topic, location, or name mentioned that is not a category, or null.

Return EXACTLY and ONLY valid JSON, with no markdown formatting, no comments, no backticks.
Example: {"category": "tech", "dateFrom": "2026-07-01", "dateTo": "2026-07-31", "keyword": "ai"}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: queryText }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const resultText = chatCompletion.choices[0].message.content;
    const parsed = JSON.parse(resultText);

    // Build MongoDB query
    const dbQuery = {};
    const filters = {};

    if (parsed.category) {
      dbQuery.category = parsed.category.toLowerCase();
      filters.category = parsed.category.toLowerCase();
    }

    if (parsed.keyword) {
      const regex = new RegExp(parsed.keyword.trim(), 'i');
      dbQuery.$or = [
        { name: regex },
        { description: regex },
        { venue: regex }
      ];
      filters.keyword = parsed.keyword.trim();
    }

    if (parsed.dateFrom || parsed.dateTo) {
      dbQuery.date = {};
      if (parsed.dateFrom) {
        dbQuery.date.$gte = new Date(parsed.dateFrom);
        filters.dateFrom = parsed.dateFrom;
      }
      if (parsed.dateTo) {
        // Set to end of day
        const toDate = new Date(parsed.dateTo);
        toDate.setHours(23, 59, 59, 999);
        dbQuery.date.$lte = toDate;
        filters.dateTo = parsed.dateTo;
      }
    }

    // Always fetch future events by default if no date was parsed
    if (!parsed.dateFrom && !parsed.dateTo) {
      dbQuery.date = { $gte: new Date() };
    }

    const events = await Event.find(dbQuery).sort({ date: 1 }).limit(20);

    return {
      filters,
      events,
      total: events.length
    };
  } catch (error) {
    console.error('Groq parsing error:', error);
    throw new ApiError(500, 'Failed to process AI search');
  }
};
