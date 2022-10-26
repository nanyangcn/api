import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import userMongoModel from 'src/models/user.mongo.model';
import tokenRedisModel from 'src/models/token.redis.model';
import { LoginReq, DecodedToken } from 'src/types/login.type';
import loginConfig from 'src/configs/login.config';

const login = async (user: LoginReq) => {
  const userDb = await userMongoModel.findUserByUsername(user.username);
  const isPwdCorrect = (userDb && userDb.passwordHash)
    && await bcrypt.compare(user.password, userDb.passwordHash);

  if (!(userDb && userDb.id && isPwdCorrect)) {
    return null;
  }
  const decodedToken: DecodedToken = { username: userDb.username, id: userDb.id };
  const token = jwt.sign(decodedToken, loginConfig.PRIVATEKEY, { expiresIn: 3600 });
  await tokenRedisModel.saveToken(userDb.id, token);
  return token;
};

export default {
  login,
};
