import dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || null;
const BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 10;
const TOKEN_EXPIRE_TIME = process.env.NODE_ENV === 'test'
  ? (Number(process.env.TEST_TOKEN_EXPIRE_TIME) || 2)
  : (Number(process.env.TOKEN_EXPIRE_TIME) || 3600);

if (!PRIVATE_KEY) {
  throw new Error('PrivateKey missing!');
}
export default {
  PRIVATE_KEY,
  BCRYPT_SALT,
  TOKEN_EXPIRE_TIME,
};
