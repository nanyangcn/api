import { Request, Response } from 'express';

import signupService from 'src/services/signup.service';
import { UserReq, userReqValidate } from 'src/types/user.type';
import reqValidate from 'src/utils/reqValidate';

const signup = async (
  req: Request<unknown, unknown, UserReq>,
  res: Response,
) => {
  reqValidate.reqValidate(req.body, userReqValidate);
  const newUser = await signupService.addUser(req.body);
  return res.status(201).json(newUser);
};

export default {
  signup,
};
