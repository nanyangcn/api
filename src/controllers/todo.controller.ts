import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import todoService from 'src/services/todo.service';
import { TodoReqWithToken, todoReqWithTokenValidate } from 'src/types/todo.type';
import { DecodedToken } from 'src/types/login.type';

import errUtil from 'src/utils/error.util';
import reqValidate from 'src/utils/reqValidate';

const getTodos = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const todos = await todoService.fetchTodos(req.body.decodedToken.username);
  return res.send(todos);
};

const getTodo = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req);
  const todo = await todoService.fetchTodoById(id, req.body.decodedToken.id);
  return res.json(todo);
};

const postTodo = async (
  req: Request<ParamsDictionary, unknown, TodoReqWithToken>,
  res: Response,
) => {
  errUtil.userIdChecker(req, req.body.decodedToken);
  reqValidate.reqValidate(req.body, todoReqWithTokenValidate);
  const newTodo = await todoService.addTodo(req.body);
  return res.status(201).json(newTodo);
};

const deleteTodo = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req);
  await todoService.removeTodoById(id, req.body.decodedToken.id);
  return res.status(204).end();
};

const putTodo = async (
  req: Request<ParamsDictionary, unknown, TodoReqWithToken>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req);
  errUtil.userIdChecker(req, req.body.decodedToken);
  reqValidate.reqValidate(req.body, todoReqWithTokenValidate);
  const todo = await todoService.replaceTodoById(id, req.body);
  return res.json(todo);
};

export default {
  getTodos,
  getTodo,
  postTodo,
  deleteTodo,
  putTodo,
};
