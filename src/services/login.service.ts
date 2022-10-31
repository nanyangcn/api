import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import userMongoModel from 'src/models/user.mongo.model';
import tokenRedisModel from 'src/models/token.redis.model';
import { LoginReq } from 'src/types/login.type';
import loginConfig from 'src/configs/login.config';
import errUtil from 'src/utils/error.util';

const login = async (user: LoginReq) => {
  const userDb = await userMongoModel.findUserByUsername(user.username);
  const isPwdCorrect = (userDb?.passwordHash)
    && await bcrypt.compare(user.password, userDb.passwordHash);

  if (!(userDb && userDb.id && isPwdCorrect)) {
    throw errUtil.errorWrapper(
      'AuthenticationError',
      'Invalid user or password',
    );
  }

  const unencodedToken = { username: userDb.username, id: userDb.id };
  const token = jwt.sign(
    unencodedToken,
    loginConfig.PRIVATE_KEY,
    {
      expiresIn: loginConfig.TOKEN_EXPIRE_TIME,
    },
  );
  await tokenRedisModel.saveToken(userDb.id, token, loginConfig.TOKEN_EXPIRE_TIME);
  return {
    id: userDb.id,
    token,
  };
};

export default {
  login,
};
