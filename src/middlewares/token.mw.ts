import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

import tokenRedisModel from 'src/models/token.redis.model';
import tokenUtil from 'src/utils/token.util';
import loginConfig from 'src/configs/login.config';
import { tokenValidate } from 'src/types/login.type';
import errUtil from 'src/utils/error.util';

const tokenVerifier = async (
  req: Request<ParamsDictionary, unknown, Record<string, unknown>>,
  _res: Response,
  next: NextFunction,
) => {
  const token = tokenUtil.tokenExtractor(req);
  if (!token) {
    throw errUtil.errorWrapper(
      'JsonWebTokenError',
      'Token missing',
    );
  }
  const decodedToken = token && jwt.verify(token, loginConfig.PRIVATE_KEY);
  if (!tokenValidate(decodedToken)) {
    throw errUtil.errorWrapper(
      'JsonWebTokenError',
      'Token invalid',
    );
  }
  const validToken = await tokenRedisModel.fetchToken(String(decodedToken.id));
  if (!validToken || validToken !== token) {
    throw errUtil.errorWrapper(
      'JsonWebTokenError',
      'Token invalid',
    );
  }
  if (req.body) {
    req.body.decodedToken = decodedToken;
  } else {
    req.body = { decodedToken };
  }
  next();
};

export default {
  tokenVerifier,
};
