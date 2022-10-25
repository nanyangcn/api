import todoMongoModel from 'models/todo.mongo.model';
import todoRedisModel from 'models/todo.redis.model';
import { TodoReqWithToken, Todo } from 'types/todo.type';
import serverConfig from 'configs/server.config';

const fetchTodos = async () => {
  const todos = await todoMongoModel.findTodos();
  return todos;
};

const fetchTodoById = async (id: string) => {
  const todoCache = serverConfig.WITHCACHE
    && await todoRedisModel.fetchFromCache(id);
  if (todoCache) {
    return JSON.parse(todoCache) as Todo;
  }
  const todo = await todoMongoModel.findTodoById(id);
  if (serverConfig.WITHCACHE && todo) {
    await todoRedisModel.saveToCache(id, JSON.stringify(todo));
  }
  return todo;
};

const addTodo = async (todo: TodoReqWithToken) => {
  const newTodo = await todoMongoModel.addTodo(todo);
  return newTodo;
};

const removeTodoById = async (id: string) => {
  if (serverConfig.WITHCACHE) {
    await todoRedisModel.deleteFromCache(id);
  }
  const deleteCount = await todoMongoModel.deleteTodoById(id);
  return deleteCount;
};

const removeTodoByIds = async (ids: string[]) => {
  if (serverConfig.WITHCACHE) {
    await todoRedisModel.deleteFromCache(ids);
  }
  const deleteCount = await todoMongoModel.deleteTodoByIds(ids);
  return deleteCount;
};

const replaceTodoById = async (id: string, todo: TodoReqWithToken) => {
  if (serverConfig.WITHCACHE) {
    await todoRedisModel.saveToCache(id, JSON.stringify(todo));
  }
  const replaceResult = await todoMongoModel.replaceTodoById(id, todo);
  return replaceResult;
};

export default {
  fetchTodos,
  fetchTodoById,
  addTodo,
  removeTodoById,
  removeTodoByIds,
  replaceTodoById,
};
