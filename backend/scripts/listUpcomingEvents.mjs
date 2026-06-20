import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: 'D:/hiringProject/backend/.env' });
await mongoose.connect(process.env.MONGODB_URI);
const Event = (await import('file:///D:/hiringProject/backend/src/models/Event.js')).default;
const now = new Date();
const events = await Event.find({ date: { $gt: now } }).select('title date availableSeats').sort({ date: 1 }).limit(5).lean();
console.log(JSON.stringify(events, null, 2));
await mongoose.disconnect();
