import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const WITH_REDIS = process.env.WITH_REDIS || false;

export default {
  PORT,
  WITH_REDIS,
};
