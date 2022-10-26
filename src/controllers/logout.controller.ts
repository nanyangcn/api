import { DecodedToken } from 'src/types/login.type';
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import logoutService from 'src/services/logout.service';
import errUtil from 'src/utils/error.util';

const deleteLogout = async (
  req: Request<ParamsDictionary, unknown, { decodedToken: DecodedToken }>,
  res: Response,
) => {
  const id = errUtil.reqIdHandler(req, req.body.decodedToken);
  await logoutService.logout(id);
  return res.status(204).end();
};

export default {
  deleteLogout,
};
