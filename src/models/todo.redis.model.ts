import db from 'src/utils/db.util';

const fetchFromCache = async <T>(key: string) => {
  const value = await db.redisClient.get(key);
  if (!value) {
    return null;
  }
  return JSON.parse(value) as T;
};

const saveToCache = async <T>(key: string, value: T) => {
  await db.redisClient.set(key, JSON.stringify(value));
};

const deleteFromCache = async (key:string | string[]) => {
  await db.redisClient.del(key);
};

export default {
  fetchFromCache,
  saveToCache,
  deleteFromCache,
};
