import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = (process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI)
  || 'mongodb://localhost:27017';
const MONGODB_NAME = process.env.NODE_ENV === 'test'
  ? 'test'
  : process.env.MONGODB_NAME || 'test';
const REDIS_URL = (process.env.NODE_ENV === 'test'
  ? process.env.TEST_REDIS_URL
  : process.env.REDIS_URL)
  || 'redis://localhost:6379';

export default {
  MONGODB_URI,
  MONGODB_NAME,
  REDIS_URL,
};
