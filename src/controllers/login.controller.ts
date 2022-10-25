import { Request, Response } from 'express';

import loginService from 'services/login.service';
import { LoginReq, loginReqValidate } from 'types/login.type';
import errUtil from 'utils/error.util';
import reqValidate from 'utils/reqValidate';

const postLogin = async (
  req: Request<unknown, unknown, LoginReq>,
  res: Response,
) => {
  reqValidate.reqValidate(req.body, loginReqValidate);
  const token = await loginService.login(req.body);
  if (!token) {
    throw errUtil.errorWrapper(
      'UsernameOrPasswordError',
      JSON.stringify('Invalid user or password'),
    );
  }
  res.send(token);
};

export default {
  postLogin,
};
