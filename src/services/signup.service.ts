import bcrypt from 'bcrypt';

import signupMongoModel from 'src/models/signup.mongo.model';
import { UserReq } from 'src/types/user.type';
import loginConfig from 'src/configs/login.config';

const addUser = async (user: UserReq) => {
  const passwordHash = await bcrypt.hash(user.password, loginConfig.BCRYPT_SALT);
  const resultUser = await signupMongoModel.addUser(user, passwordHash);
  return resultUser;
};

export default {
  addUser,
};
