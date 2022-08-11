import { ObjectId } from 'mongodb';
import db from 'utils/db.util';
import { Todo } from 'types/todo.type';

const jsonSchema = {
  bsonType: 'object',
  required: [
    'title',
    'done',
  ],
  additionalProperties: false,
  properties: {
    _id: {
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

const transFromDb = (data: Todo) => {
  const oIdKey = '_id';
  const newData: Todo = {
    ...data,
    id: data[oIdKey]?.toString(),
  };
  delete newData[oIdKey];
  return newData;
};

const transToDb = (data: Todo) => {
  const newDate: Todo = {
    ...data,
    deadline: data.deadline && new Date(data.deadline),
  };
  delete newDate.id;
  return newDate;
};

const collName = 'todos';
const uniKey = 'title';

const findTodos = async () => {
  const coll = await db.createOrGetColl<Todo>(collName, uniKey, jsonSchema);
  const todos = await coll.find({}).toArray();
  return todos.map(transFromDb);
};

const findTodoById = async (id: string) => {
  const coll = await db.createOrGetColl<Todo>(collName, uniKey, jsonSchema);
  const todo = await coll.findOne({ _id: new ObjectId(id) });
  return todo && transFromDb(todo);
};

const addTodo = async (newTodo: Todo) => {
  const coll = await db.createOrGetColl<Todo>(collName, uniKey, jsonSchema);
  const newTodoInDb = transToDb(newTodo);
  await coll.insertOne(newTodoInDb);
  return transFromDb(newTodoInDb);
};

const deleteTodoById = async (id: string) => {
  const coll = await db.createOrGetColl<Todo>(collName, uniKey, jsonSchema);
  const deleteResult = await coll.deleteOne({ _id: new ObjectId(id) });
  return deleteResult.deletedCount;
};

const replaceTodoById = async (id: string, newTodo: Todo) => {
  const coll = await db.createOrGetColl<Todo>(collName, uniKey, jsonSchema);
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
  replaceTodoById,
};
