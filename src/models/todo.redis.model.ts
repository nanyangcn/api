import db from 'utils/db.util';

const fetchFromCache = async (key: string) => {
  const value = await db.redisClient.get(key);
  return value;
};

const saveToCache = async (key: string, value: string) => {
  await db.redisClient.set(key, value);
};

const deleteFromCache = async (key:string | string[]) => {
  await db.redisClient.del(key);
};

export default {
  fetchFromCache,
  saveToCache,
  deleteFromCache,
};
