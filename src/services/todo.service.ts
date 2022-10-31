import todoMongoModel from 'src/models/todo.mongo.model';
import todoRedisModel from 'src/models/todo.redis.model';
import { TodoReqWithToken, Todo } from 'src/types/todo.type';
import serverConfig from 'src/configs/server.config';
import errUtil from 'src/utils/error.util';

const fetchTodos = async (username: string) => {
  errUtil.rootChecker(username);
  const todos = await todoMongoModel.findTodos();
  return todos;
};

const fetchTodoById = async (id: string) => {
  const todoCache = serverConfig.WITH_REDIS
    && await todoRedisModel.fetchFromCache(id);
  if (todoCache) {
    return JSON.parse(todoCache) as Todo;
  }
  const todo = await todoMongoModel.findTodoById(id);
  if (serverConfig.WITH_REDIS && todo) {
    await todoRedisModel.saveToCache(id, JSON.stringify(todo));
  }
  const notNullTodo = errUtil.itemNotFoundHandler(todo);
  return notNullTodo;
};

const addTodo = async (todo: TodoReqWithToken) => {
  const newTodo = await todoMongoModel.addTodo(todo);
  return newTodo;
};

const removeTodoById = async (id: string) => {
  if (serverConfig.WITH_REDIS) {
    await todoRedisModel.deleteFromCache(id);
  }
  const deleteCount = await todoMongoModel.deleteTodoById(id);
  return deleteCount;
};

const removeTodoByIds = async (ids: string[]) => {
  if (ids.length === 0) {
    return 0;
  }
  if (serverConfig.WITH_REDIS) {
    await todoRedisModel.deleteFromCache(ids);
  }
  const deleteCount = await todoMongoModel.deleteTodoByIds(ids);
  return deleteCount;
};

const replaceTodoById = async (id: string, todo: TodoReqWithToken) => {
  if (serverConfig.WITH_REDIS) {
    await todoRedisModel.saveToCache(id, JSON.stringify(todo));
  }
  const replaceResult = await todoMongoModel.replaceTodoById(id, todo);
  const notNullTodo = errUtil.itemNotFoundHandler(replaceResult.todo, replaceResult.count);
  return notNullTodo;
};

export default {
  fetchTodos,
  fetchTodoById,
  addTodo,
  removeTodoById,
  removeTodoByIds,
  replaceTodoById,
};
