import { ObjectId } from 'mongodb';
import db from 'src/utils/db.util';
import { Todo, TodoReqWithToken } from 'src/types/todo.type';

export interface TodoMongo {
  _id?: ObjectId;
  user_id: ObjectId;
  title: string;
  description?: string;
  done: boolean;
  deadline?: Date;
}

const bsonSchema = {
  bsonType: 'object',
  required: [
    'user_id',
    'title',
    'done',
  ],
  additionalProperties: false,
  properties: {
    _id: {
      bsonType: 'objectId',
    },
    user_id: {
      bsonType: 'objectId',
    },
    title: {
      bsonType: 'string',
      description: 'title must be a string',
    },
    description: {
      bsonType: 'string',
      description: 'description must be a string',
    },
    done: {
      bsonType: 'bool',
      description: 'done must be a boolean',
    },
    deadline: {
      bsonType: 'date',
      description: 'deadline must be a date',
    },
  },
};

const transFromDb = (data: TodoMongo) => {
  const oIdKey = '_id';
  const newData: Todo = {
    id: data[oIdKey]?.toString(),
    userId: data.user_id.toString(),
    title: data.title,
    description: data.description,
    done: data.done,
    deadline: data.deadline,
  };
  return newData;
};

const transToDb = (data: TodoReqWithToken) => {
  const newData: TodoMongo = {
    user_id: new ObjectId(data.userId),
    title: data.title,
    description: data.description,
    done: data.done,
    deadline: data.deadline ? new Date(data.deadline) : undefined,
  };
  return newData;
};

const collName = 'todos';
const uniKeys = ['title'];

const findTodos = async () => {
  const coll = await db.createOrGetColl<TodoMongo>(collName, uniKeys, bsonSchema);
  const todos = await coll.find({}).toArray();
  return todos.map(transFromDb);
};

const findTodoById = async (id: string) => {
  const coll = await db.createOrGetColl<TodoMongo>(collName, uniKeys, bsonSchema);
  const todo = await coll.findOne({ _id: new ObjectId(id) });
  return todo && transFromDb(todo);
};

const addTodo = async (newTodo: TodoReqWithToken) => {
  const coll = await db.createOrGetColl<TodoMongo>(collName, uniKeys, bsonSchema);
  const newTodoInDb = transToDb(newTodo);
  await coll.insertOne(newTodoInDb);
  return transFromDb(newTodoInDb);
};

const deleteTodoById = async (id: string) => {
  const coll = await db.createOrGetColl<TodoMongo>(collName, uniKeys, bsonSchema);
  const deleteResult = await coll.deleteOne({ _id: new ObjectId(id) });
  return deleteResult.deletedCount;
};

const deleteTodoByIds = async (ids: string[]) => {
  const coll = await db.createOrGetColl<TodoMongo>(collName, uniKeys, bsonSchema);
  const deleteResult = await coll.deleteMany({
    _id: {
      $in: ids.map((id) => new ObjectId(id)),
    },
  });
  return deleteResult.deletedCount;
};

const replaceTodoById = async (id: string, newTodo: TodoReqWithToken) => {
  const coll = await db.createOrGetColl<TodoMongo>(collName, uniKeys, bsonSchema);
  const newTodoInDb = transToDb(newTodo);
  const replaceResult = await coll.replaceOne({ _id: new ObjectId(id) }, newTodoInDb);
  return {
    count: replaceResult.modifiedCount as number,
    todo: transFromDb(newTodoInDb),
  };
};

export default {
  findTodos,
  findTodoById,
  addTodo,
  deleteTodoById,
  deleteTodoByIds,
  replaceTodoById,
  transFromDb,
};
