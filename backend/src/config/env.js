import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env file from the backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET'];

for (const name of requiredEnv) {
  if (!process.env[name]) {
    console.error(`Error: Missing required environment variable: ${name}`);
    process.exit(1);
  }
}

export const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
