import { ObjectId } from 'mongodb';
import db from 'src/utils/db.util';
import { UserReq, User } from 'src/types/user.type';

export interface UserMongo {
  _id?: ObjectId;
  username: string;
  passwordHash: string;
}

const bsonSchema = {
  bsonType: 'object',
  required: [
    'username',
    'passwordHash',
  ],
  additionalProperties: false,
  properties: {
    _id: {
      bsonType: 'objectId',
    },
    username: {
      bsonType: 'string',
      description: 'username must be a string',
    },
    passwordHash: {
      bsonType: 'string',
      description: 'passwordHash must be a string',
    },
  },
};

const transFromDb = (data: UserMongo) => {
  const oIdKey = '_id';
  const newData: User = {
    id: data[oIdKey]?.toString(),
    username: data.username,
    todos: [],
  };
  return newData;
};

const transToDb = (data: UserReq, passwordHash: string) => {
  const newData: UserMongo = {
    username: data.username,
    passwordHash,
  };
  return newData;
};

const collName = 'user';
const uniKeys = ['username'];

const addUser = async (newUser: UserReq, passwordHash: string) => {
  const coll = await db.createOrGetColl<UserMongo>(collName, uniKeys, bsonSchema);
  const newUserInDb = transToDb(newUser, passwordHash);
  await coll.insertOne(newUserInDb);
  return transFromDb(newUserInDb);
};

export default {
  addUser,
};
