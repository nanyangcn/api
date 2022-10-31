import { ObjectId } from 'mongodb';
import db from 'src/utils/db.util';
import { User, UserReq } from 'src/types/user.type';
import todoMongoModel, { TodoMongo } from 'src/models/todo.mongo.model';

export interface UserMongo {
  _id?: ObjectId;
  username: string;
  passwordHash?: string;
  todos?: TodoMongo[]
}

const bsonSchema = {
  bsonType: 'object',
  required: [
    'username',
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
  },
};

const transFromDb = (data: UserMongo, showPwdHash = false) => {
  const oIdKey = '_id';
  const newData: User = {
    id: data[oIdKey]?.toString(),
    username: data.username,
    passwordHash: showPwdHash ? data.passwordHash : undefined,
    todos: data.todos?.map(todoMongoModel.transFromDb) || [],
  };
  return newData;
};

const transToDb = (data: UserReq) => {
  const newData: UserMongo = {
    username: data.username,
  };
  return newData;
};

const collName = 'user';
const uniKeys = ['username'];

const findUsers = async () => {
  const coll = await db.createOrGetColl<UserMongo>(collName, uniKeys, bsonSchema);
  const users = await coll.find({}).toArray();
  return users.map((user) => transFromDb(user));
};

const findUserById = async (id: string) => {
  const coll = await db.createOrGetColl<UserMongo>(collName, uniKeys, bsonSchema);
  const user = await coll.aggregate<UserMongo>([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup:
      {
        from: 'todos',
        localField: '_id',
        foreignField: 'user_id',
        as: 'todos',
      },
    },
  ]).toArray();
  return user[0] && transFromDb(user[0]);
};

const findUserByUsername = async (username: string) => {
  const coll = await db.createOrGetColl<UserMongo>(collName, uniKeys, bsonSchema);
  const user = await coll.aggregate<UserMongo>([
    {
      $match: {
        username,
      },
    },
    {
      $lookup:
      {
        from: 'todos',
        localField: '_id',
        foreignField: 'user_id',
        as: 'todos',
      },
    },
  ]).toArray();
  return user[0] && transFromDb(user[0], true);
};

const deleteUserById = async (id: string) => {
  const coll = await db.createOrGetColl<UserMongo>(collName, uniKeys, bsonSchema);
  const deleteResult = await coll.deleteOne({ _id: new ObjectId(id) });
  return deleteResult.deletedCount;
};

const replaceUserById = async (id: string, newUser: UserReq) => {
  const coll = await db.createOrGetColl<UserMongo>(collName, uniKeys, bsonSchema);
  const newUserInDb = transToDb(newUser);
  const replaceResult = await coll.replaceOne({ _id: new ObjectId(id) }, newUserInDb);
  return {
    count: replaceResult.modifiedCount as number,
    user: transFromDb(newUserInDb),
  };
};

export default {
  findUsers,
  findUserById,
  findUserByUsername,
  deleteUserById,
  replaceUserById,
};
