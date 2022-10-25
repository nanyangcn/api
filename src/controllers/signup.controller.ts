import { Request, Response } from 'express';

import signupService from 'services/signup.service';
import { UserReq, userReqValidate } from 'types/user.type';
import reqValidate from 'utils/reqValidate';

const signup = async (
  req: Request<unknown, unknown, UserReq>,
  res: Response,
) => {
  reqValidate.reqValidate(req.body, userReqValidate);
  const newUser = await signupService.addUser(req.body);
  return res.json(newUser);
};

export default {
  signup,
};
