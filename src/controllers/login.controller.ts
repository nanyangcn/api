import { Request, Response } from 'express';

import loginService from 'src/services/login.service';
import { LoginReq, loginReqValidate } from 'src/types/login.type';
import reqValidate from 'src/utils/reqValidate';

const postLogin = async (
  req: Request<unknown, unknown, LoginReq>,
  res: Response,
) => {
  reqValidate.reqValidate(req.body, loginReqValidate);
  const token = await loginService.login(req.body);
  return res.json(token);
};

export default {
  postLogin,
};
