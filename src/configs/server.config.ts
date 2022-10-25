import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const WITHCACHE = process.env.WITHCACHE || false;

export default {
  PORT,
  WITHCACHE,
};
