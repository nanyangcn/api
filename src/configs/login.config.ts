import dotenv from 'dotenv';

dotenv.config();

const PRIVATEKEY = process.env.PRIVATEKEY || null;
const BCRYPTSALT = Number(process.env.BCRYPTSALT) || 10;

if (!PRIVATEKEY) {
  throw new Error('PrivateKey missing!');
}

export default {
  PRIVATEKEY,
  BCRYPTSALT,
};
