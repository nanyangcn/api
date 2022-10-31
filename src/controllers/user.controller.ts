import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import userService from 'src/services/user.service';
import { UserReqWithToken, userReqWithTokenValidate } from 'src/types/user.type';
import { DecodedToken } from 'src/types/login.type';
import errUtil from 'src/utils/error.util';
import reqValidate from 'src/utils/reqValidate';

const getUsers = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const users = await userService.fetchUsers(req.body.decodedToken.username);
  return res.send(users);
};

const getUser = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req, req.body.decodedToken);
  const user = await userService.fetchUserById(id);
  return res.json(user);
};

const deleteUser = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req, req.body.decodedToken);
  await userService.removeUserById(id);
  return res.status(204).end();
};

const putUser = async (
  req: Request<ParamsDictionary, unknown, UserReqWithToken>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req, req.body.decodedToken);
  reqValidate.reqValidate(req.body, userReqWithTokenValidate);
  const user = await userService.replaceUserById(id, req.body);
  return res.json(user);
};

export default {
  getUsers,
  getUser,
  deleteUser,
  putUser,
};
