import dotenv from 'dotenv';

dotenv.config();

const {
  PRIVATEKEY,
  BCRYPTSALT = 10,
} = process.env;

if (!PRIVATEKEY) {
  throw new Error('PrivateKey missing!');
}

export default {
  PRIVATEKEY,
  BCRYPTSALT,
};
