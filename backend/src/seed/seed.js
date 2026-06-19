import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Event from '../models/Event.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const eventsData = [
  {
    name: "Underground Beats Festival",
    description: "Experience the best underground electronic and house music from global and local DJs in an industrial warehouse vibe.",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    venue: "The Hangar, Warehouse District",
    category: "music",
    totalSeats: 150,
    availableSeats: 150,
    price: 1299,
  },
  {
    name: "Sunset Symphony on the Lawn",
    description: "Relax under the stars with live classical scores played by the Metropolitan Philharmonic Orchestra.",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
    venue: "Botanical Gardens amphitheater",
    category: "music",
    totalSeats: 200,
    availableSeats: 200,
    price: 899,
  },
  {
    name: "Acoustic Nights: Loft Session",
    description: "An intimate evening of indie songwriters performing raw, acoustic sets in an industrial brick loft.",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    venue: "The Brickroom Attic",
    category: "music",
    totalSeats: 50,
    availableSeats: 50,
    price: 499,
  },
  {
    name: "NextGen AI Summit 2026",
    description: "Explore the bleeding edge of Large Language Models, generative video, agentic workflows, and ethical AI developments.",
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days
    venue: "Convention Center, Hall A",
    category: "tech",
    totalSeats: 300,
    availableSeats: 300,
    price: 2499,
  },
  {
    name: "Javascript Pioneers Workshop",
    description: "Deep dive into JS frameworks, modern state managers, V8 internals, and the future of rendering paradigms.",
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days
    venue: "TechHub Labs, 4th Floor",
    category: "tech",
    totalSeats: 80,
    availableSeats: 80,
    price: 0, // Free event
  },
  {
    name: "Cybersecurity Threat Hunt",
    description: "Hands-on capture-the-flag (CTF) tournament focused on malware analysis, server penetration, and security hardening.",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    venue: "SecureOps Cyber Arena",
    category: "tech",
    totalSeats: 60,
    availableSeats: 60,
    price: 599,
  },
  {
    name: "Championship Derby Finale",
    description: "Watch the top regional horse racing teams battle it out for the ultimate Golden Saddle trophy.",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days
    venue: "Royal Turf Downs Derby Track",
    category: "sports",
    totalSeats: 500,
    availableSeats: 500,
    price: 1500,
  },
  {
    name: "Midnight City Marathon",
    description: "A gorgeous night-time marathon wrapping through lit skyscrapers, urban bridges, and coastal pathways.",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
    venue: "Central Plaza Start Line",
    category: "sports",
    totalSeats: 1000,
    availableSeats: 1000,
    price: 299,
  },
  {
    name: "Stand-Up Showdown: Late Night Comedy",
    description: "Prepare to laugh till it hurts with five award-winning comics performing uncensored late-night routines.",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    venue: "The Laugh Factory Underground",
    category: "comedy",
    totalSeats: 120,
    availableSeats: 120,
    price: 399,
  },
  {
    name: "Improv Under the Stars",
    description: "A fast-paced comedy show entirely generated from live audience suggestions under the open sky.",
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days
    venue: "Rooftop Garden Lounge",
    category: "comedy",
    totalSeats: 80,
    availableSeats: 80,
    price: 199,
  },
  {
    name: "Neon Canvas Exhibition",
    description: "A visually stunning showcase of local digital, projection-mapping, and ultraviolet neon artists.",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
    venue: "Fluorescent Art Pavilion",
    category: "art",
    totalSeats: 150,
    availableSeats: 150,
    price: 250,
  },
  {
    name: "Sculpting Clay Masterclass",
    description: "Hands-on pottery workshop teaching classical wheel throwing, glazing techniques, and hand-building forms.",
    date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days
    venue: "The Clayworks Studio",
    category: "art",
    totalSeats: 25,
    availableSeats: 25,
    price: 999,
  },
  {
    name: "Artisanal Cheese & Wine Tasting",
    description: "Pairing imported raw-milk cheeses with organic wines, guided by award-winning sommelier Marcus Vane.",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    venue: "Vignette Tasting Cellars",
    category: "food",
    totalSeats: 40,
    availableSeats: 40,
    price: 1800,
  },
  {
    name: "Spice Route: Street Food Gala",
    description: "A colorful food market featuring over 30 street food stalls from around the globe serving traditional delicacies.",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
    venue: "Open Air Promenade",
    category: "food",
    totalSeats: 300,
    availableSeats: 300,
    price: 499,
  },
  {
    name: "Shakespeare Reimagined: Hamlet in VR",
    description: "A hybrid theatrical performance mixing live stage actors with custom VR headsets for the audience.",
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // 18 days
    venue: "Oculus Black Box Theater",
    category: "theater",
    totalSeats: 75,
    availableSeats: 75,
    price: 1199,
  },
  {
    name: "Broadway Classics Medley",
    description: "Enjoy highlights and hits from the biggest musicals in history, performed live by top theater vocalists.",
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days
    venue: "Grand Opera Playhouse",
    category: "theater",
    totalSeats: 180,
    availableSeats: 180,
    price: 799,
  },
  {
    name: "Financial Freedom Bootcamp",
    description: "Master personal budgeting, retirement accounts, index fund investing, and building multiple income streams.",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    venue: "Summit Hall B, Business Centre",
    category: "workshop",
    totalSeats: 100,
    availableSeats: 100,
    price: 1499,
  },
  {
    name: "Smartphone Photography Workshop",
    description: "Learn composition, dynamic lighting hacks, color grading, and editing secrets using just your mobile phone.",
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    venue: "Metropolitan Park West",
    category: "workshop",
    totalSeats: 35,
    availableSeats: 35,
    price: 350,
  },
  {
    name: "Global Sustainability Forum 2026",
    description: "Leading environmentalists and policy experts discuss climate mitigation, carbon markets, and circular economy design.",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    venue: "GreenTech Eco Centre Auditorium",
    category: "conference",
    totalSeats: 250,
    availableSeats: 250,
    price: 0, // Free event
  },
  {
    name: "Creative Minds Design Conference",
    description: "Two days of inspiring keynotes, panel discussions, and collaborative sprints for UI/UX, product, and brand designers.",
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days
    venue: "Designers Hub Auditorium",
    category: "conference",
    totalSeats: 150,
    availableSeats: 150,
    price: 1999,
  }
];

const seedEvents = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error("Error: MONGODB_URI is not defined in the environment.");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Delete existing events
    await Event.deleteMany({});
    console.log("Cleared existing events.");

    // Insert new events
    const createdEvents = await Event.insertMany(eventsData);
    console.log(`Successfully seeded ${createdEvents.length} events!`);

    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedEvents();
