import tokenRedisModel from 'models/token.redis.model';

const logout = async (id: string) => {
  await tokenRedisModel.revokeToken(id);
};

export default {
  logout,
};
