import {
  MongoClient, Collection,
} from 'mongodb';
import { getErrMsg } from 'utils/errParser';
import config from 'configs/db.config';
import logger from 'utils/logger';

const client = new MongoClient(config.MONGODB_URI);

const connectDb = async () => {
  try {
    await client.connect();
    logger.info(`Db: Successfully connected to MongoDB: ${config.MONGODB_NAME}`);
  } catch (err) {
    logger.error(`Db: Failed to connect to MongoDB: ${getErrMsg(err)}`);
  }
};

const closeDb = async () => {
  try {
    await client.close();
    logger.info('Db: Successfully closed MongoDB connection');
  } catch (err) {
    logger.error(`Db: Failed to close MongoDB connection: ${getErrMsg(err)}`);
  }
};

const colls: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: Collection<any>
} = {};

const createOrGetColl = async <T>(
  collName: string,
  uniqueKey?: string,
  jsonSchema?: Record<string, unknown>,
) => {
  const db = client.db(config.MONGODB_NAME);
  if (colls[collName]) return colls[collName] as Collection<T>;
  try {
    const coll = await db.createCollection<T>(collName, {
      validator: {
        $jsonSchema: jsonSchema,
      },
    });
    logger.info(`Db: Successfully created collection: ${collName}`);
    if (uniqueKey) {
      await coll.createIndex(uniqueKey, { unique: true });
    }
    colls[collName] = coll;
    return coll;
  } catch (err) {
    const errMsg = getErrMsg(err);
    if (errMsg.includes('Collection already exists.')) {
      logger.info(`Db: Successfully got collection: ${collName}`);
      const coll = db.collection<T>(collName);
      colls[collName] = coll;
      return coll;
    }
    return Promise.reject(new Error(`Db: Failed to get collection: ${errMsg}`));
  }
};

export default {
  connectDb,
  closeDb,
  createOrGetColl,
};
