import { MongoClient, Db } from 'mongodb';

import { getErrorMessage } from 'utils/dbErrorParser';

import config from 'configs/db.config';
import logger from 'utils/logger';

const client = new MongoClient(config.MONGODB_URI);

const connectMongoDb = async ():Promise<Db | null> => {
  try {
    await client.connect();
    const db = client.db(config.MONGODB_NAME);
    logger.info(`Successfully connected to MongoDB: ${config.MONGODB_NAME}`);
    return db;
  } catch (err: unknown) {
    logger.error(`Failed to connect to MongoDB: ${getErrorMessage(err)}`);
  }
  return null;
};

export default {
  connectMongoDb,
};
