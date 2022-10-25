import bcrypt from 'bcrypt';

import signupMongoModel from 'models/signup.mongo.model';
import { UserReq } from 'types/user.type';
import loginConfig from 'configs/login.config';

const addUser = async (user: UserReq) => {
  const passwordHash = await bcrypt.hash(user.password, loginConfig.BCRYPTSALT);
  const resultUser = await signupMongoModel.addUser(user, passwordHash);
  return resultUser;
};

export default {
  addUser,
};
