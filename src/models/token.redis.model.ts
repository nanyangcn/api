import db from 'src/utils/db.util';

const fetchToken = async (key: string) => {
  const value = await db.redisClient.get(key);
  return value;
};

const saveToken = async (key: string, value: string, expiresIn: number) => {
  await db.redisClient.set(key, value, {
    EX: expiresIn,
  });
};

const revokeToken = async (key: string) => {
  await db.redisClient.del(key);
};

export default {
  fetchToken,
  saveToken,
  revokeToken,
};
