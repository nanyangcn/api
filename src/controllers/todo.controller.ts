import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import todoService from 'services/todo.service';
import { Todo, TodoReqWithToken, todoReqWithTokenValidate } from 'types/todo.type';
import errUtil from 'utils/error.util';
import reqValidate from 'utils/reqValidate';

const getTodos = async (_req: Request, res: Response<Todo[]>) => {
  const todos = await todoService.fetchTodos();
  return res.send(todos);
};

const getTodo = async (
  req: Request<ParamsDictionary, unknown, unknown>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req);
  const todo = await todoService.fetchTodoById(id);
  const notNullTodo = errUtil.itemNotFoundHandler(todo);
  res.json(notNullTodo);
};

const postTodo = async (
  req: Request<ParamsDictionary, unknown, TodoReqWithToken>,
  res: Response,
) => {
  errUtil.userIdChecker(req, req.body.decodedToken);
  reqValidate.reqValidate(req.body, todoReqWithTokenValidate);
  const newTodo = await todoService.addTodo(req.body);
  res.json(newTodo);
};

const deleteTodo = async (
  req: Request<ParamsDictionary, unknown, unknown>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req);
  await todoService.removeTodoById(id);
  res.status(204).end();
};

const putTodo = async (
  req: Request<ParamsDictionary, unknown, TodoReqWithToken>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req);
  errUtil.userIdChecker(req, req.body.decodedToken);
  reqValidate.reqValidate(req.body, todoReqWithTokenValidate);
  const { count, todo } = await todoService.replaceTodoById(id, req.body);
  const notNullTodo = errUtil.itemNotFoundHandler(todo, count);
  res.json(notNullTodo);
};

export default {
  getTodos,
  getTodo,
  postTodo,
  deleteTodo,
  putTodo,
};
