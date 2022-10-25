import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import userService from 'services/user.service';
import { User, UserReqWithToken, userReqWithTokenValidate } from 'types/user.type';
import { DecodedToken } from 'types/login.type';
import errUtil from 'utils/error.util';
import reqValidate from 'utils/reqValidate';

const getUsers = async (_req: Request, res: Response<User[]>) => {
  const users = await userService.fetchUsers();
  return res.send(users);
};

const getUser = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req, req.body.decodedToken);
  const user = await userService.fetchUserById(id);
  const notNullUser = errUtil.itemNotFoundHandler(user);
  return res.json(notNullUser);
};

const deleteUser = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response<User | string>,
) => {
  const id = errUtil.reqIdHandler(req, req.body.decodedToken);
  await userService.removeUserById(id);
  return res.status(204).end();
};

const putUser = async (
  req: Request<ParamsDictionary, unknown, UserReqWithToken>,
  res: Response<User | string>,
) => {
  const id = errUtil.reqIdHandler(req, req.body.decodedToken);
  reqValidate.reqValidate(req.body, userReqWithTokenValidate);
  const { count, user } = await userService.replaceUserById(id, req.body);
  const notNullUser = errUtil.itemNotFoundHandler(user, count);
  return res.json(notNullUser);
};

export default {
  getUsers,
  getUser,
  deleteUser,
  putUser,
};
