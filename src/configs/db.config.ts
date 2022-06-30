import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_NAME = process.env.MONGODB_NAME || 'test';

export default {
  MONGODB_URI,
  MONGODB_NAME,
};
