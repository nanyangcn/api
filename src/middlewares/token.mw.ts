import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

import tokenRedisModel from 'models/token.redis.model';
import tokenUtil from 'utils/token.util';
import loginConfig from 'configs/login.config';
import { tokenValidate } from 'types/login.type';

const tokenVerifier = async (
  err: Error,
  req: Request<ParamsDictionary, unknown, Record<string, unknown>>,
  _res: Response,
  next: NextFunction,
) => {
  const token = tokenUtil.tokenExtractor(req);
  if (!token) {
    throw new Error('Token missing');
  }
  const decodedToken = token && jwt.verify(token, loginConfig.PRIVATEKEY);
  if (!tokenValidate(decodedToken)) {
    throw new Error('Token invalid');
  }
  const validToken = await tokenRedisModel.fetchToken(String(decodedToken.id));
  if (!validToken || validToken !== token) {
    throw new Error('Token invalid');
  }
  req.body.decodedToken = decodedToken;
  next(err);
};

export default {
  tokenVerifier,
};
