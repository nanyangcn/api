import { MongoClient, Document } from 'mongodb';
import { createClient } from 'redis';
import { getErrMsg } from 'src/utils/errParser';
import dbConfig from 'src/configs/db.config';
import serverConfig from 'src/configs/server.config';
import logger from 'src/utils/logger';

const mongoClient = new MongoClient(dbConfig.MONGODB_URI);
const db = mongoClient.db(dbConfig.MONGODB_NAME);
const redisClient = createClient({ url: dbConfig.REDIS_URL });
redisClient.on('error', (err) => logger.error(`Redis Client Error ${getErrMsg(err)}`));

const connectMongo = async () => {
  try {
    await mongoClient.connect();
    logger.info(`Connected to MongoDB: ${dbConfig.MONGODB_NAME}`);
  } catch (err) {
    logger.error(`Failed to connect to MongoDB: ${getErrMsg(err)}`);
  }
};

const closeMongo = async () => {
  try {
    await mongoClient.close();
    logger.info('Closed MongoDB connection');
  } catch (err) {
    logger.error(`Failed to close MongoDB connection: ${getErrMsg(err)}`);
  }
};

const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info('Connected to Redis');
  } catch (err) {
    logger.error(`Failed to connect to Redis: ${getErrMsg(err)}`);
  }
};

const closeRedis = async () => {
  try {
    await redisClient.disconnect();
    logger.info('Closed Redis connection');
  } catch (err) {
    logger.error(`Failed to close Redis connection: ${getErrMsg(err)}`);
  }
};

const connectDb = async () => {
  await connectMongo();
  if (serverConfig.WITH_REDIS) {
    await connectRedis();
  }
};

const closeDb = async () => {
  if (serverConfig.WITH_REDIS) {
    await closeRedis();
  }
  await closeMongo();
};

const createOrGetColl = async <T extends Document>(
  collName: string,
  uniqueKeys?: string[],
  jsonSchema?: Record<string, unknown>,
) => {
  try {
    const coll = await db.createCollection<T>(collName, {
      validator: {
        $jsonSchema: jsonSchema,
      },
    });
    logger.info(`Created collection: ${collName}`);
    if (uniqueKeys?.length && uniqueKeys?.length > 0) {
      await Promise.all(
        uniqueKeys.map((key: string) => coll.createIndex(key, { unique: true })),
      );
    }
    return coll;
  } catch (err) {
    const errMsg = getErrMsg(err);
    if (errMsg.includes('Collection') && errMsg.includes('already exists')) {
      const coll = db.collection<T>(collName);
      return coll;
    }
    return Promise.reject(new Error(`Failed to get collection: ${errMsg}`));
  }
};

const cleanMongo = async () => {
  await db.dropDatabase();
};

const cleanRedis = async () => {
  await redisClient.flushAll();
};

const cleanDb = async () => {
  await cleanMongo();
  await cleanRedis();
};

export default {
  mongoClient,
  redisClient,
  connectDb,
  closeDb,
  createOrGetColl,
  cleanMongo,
  cleanRedis,
  cleanDb,
};
