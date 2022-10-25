import { DecodedToken } from 'types/login.type';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { idValidate } from 'types/id.type';

const errorWrapper = (name: string, msg: string) => {
  const err = new Error(msg);
  err.name = name;
  return err;
};

const reqIdHandler = (req: Request<ParamsDictionary>, decodedToken?: DecodedToken) => {
  const { id } = req.params;
  if (!id || !idValidate(id)) {
    throw errorWrapper(
      'MalformattedIdError',
      'Missing or invalid id',
    );
  }
  if (decodedToken && id !== decodedToken.id) {
    throw errorWrapper(
      'UnauthorizedError',
      'Item not authorized to user',
    );
  }
  return id;
};

const userIdChecker = <T extends { userId: string }>(
  req: Request<ParamsDictionary, unknown, T>,
  decodedToken: DecodedToken) => {
  const { userId } = req.body;
  if (userId !== decodedToken.id) {
    throw errorWrapper(
      'UnauthorizedError',
      'User not authorized to user',
    );
  }
};

const itemNotFoundHandler = <T>(item: T, count?: number) => {
  if (!item || count === 0) {
    throw errorWrapper(
      'NotFoundError',
      'Item not found',
    );
  }
  return item;
};

export default {
  errorWrapper,
  reqIdHandler,
  userIdChecker,
  itemNotFoundHandler,
};
