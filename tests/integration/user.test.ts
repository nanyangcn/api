import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { setTimeout } from 'timers/promises';

import app from 'src/app';
import db from 'src/utils/db.util';
import { UserReq, User } from 'src/types/user.type';
import { DecodedToken } from 'src/types/login.type';
import loginConfig from 'src/configs/login.config';

const api = supertest(app);

export const signup = async (user: UserReq) => {
  interface ResBody extends User {
    error: string
  }
  const res = await api.post('/api/signup').send(user);
  const body = res.body as ResBody;
  const { id, username, error } = body;
  if (error) {
    return {
      statusCode: res.statusCode,
      error,
    };
  }
  expect(res.statusCode).toBe(201);
  expect(typeof id).toBe('string');
  expect(username).toBe(user.username);
  return {
    statusCode: res.statusCode,
    id,
    username,
  };
};

interface LoginResult {
  id: string;
  token: string;
}

export const login = async (user: UserReq) => {
  interface ResBody {
    token: string;
    error: string
  }
  const res = await api.post('/api/login').send(user);
  const body = res.body as ResBody;
  const { token, error } = body;
  if (error) {
    return {
      statusCode: res.statusCode,
      error,
    };
  }
  expect(res.statusCode).toBe(200);
  expect(typeof token).toBe('string');
  const decodedToken = jwt.verify(token, loginConfig.PRIVATE_KEY) as DecodedToken;
  expect(decodedToken.username).toBe(user.username);
  expect(typeof decodedToken.id).toBe('string');
  return {
    statusCode: res.statusCode,
    id: decodedToken.id,
    token,
  };
};

export const logout = async (id: string, token: string) => {
  interface ResBody {
    error: string
  }
  const res = await api.delete(`/api/logout/${id}`)
    .auth(token, { type: 'bearer' });
  const body = res.body as ResBody;
  const { error } = body;
  if (error) {
    return {
      statusCode: res.statusCode,
      error,
    };
  }
  expect(res.statusCode).toBe(204);
  return {
    statusCode: res.statusCode,
  };
};

export const getAll = async (token: string) => {
  interface UsersBody extends Array<User> {
    error: string
  }
  const res = await api.get('/api/user')
    .auth(token, { type: 'bearer' });
  const body = res.body as UsersBody;
  const { error } = body;
  if (error) {
    return {
      statusCode: res.statusCode,
      error,
    };
  }
  expect(res.statusCode).toBe(200);
  return {
    statusCode: res.statusCode,
    users: body,
  };
};

export const unregister = async (id: string, token: string) => {
  interface ResBody {
    error: string
  }
  const res = await api.delete(`/api/user/${id}`)
    .auth(token, { type: 'bearer' });
  const body = res.body as ResBody;
  const { error } = body;
  if (error) {
    return {
      statusCode: res.statusCode,
      error,
    };
  }
  expect(res.statusCode).toBe(204);
  return {
    statusCode: res.statusCode,
  };
};

export const put = async (id: string, newUser: UserReq, token: string) => {
  interface ResBody extends User {
    error: string;
  }
  const res = await api.put(`/api/user/${id}`)
    .send(newUser)
    .auth(token, { type: 'bearer' });
  const body = res.body as ResBody;
  const { error } = body;
  if (error) {
    return {
      statusCode: res.statusCode,
      error,
    };
  }
  expect(res.statusCode).toBe(200);
  expect(body).toBe(newUser);
  return {
    statusCode: res.statusCode,
    user: body,
  };
};

describe('User test', () => {
  const root: UserReq = {
    username: 'root',
    password: 'password',
  };
  const user0: UserReq = {
    username: 'user0',
    password: 'password0',
  };
  const user1: UserReq = {
    username: 'user1',
    password: 'password1',
  };
  const user0WrongPwd: UserReq = {
    username: 'user0',
    password: 'password1',
  };

  beforeAll(async () => {
    await db.connectDb();
  });

  afterAll(async () => {
    await db.closeDb();
  });

  beforeEach(async () => {
    await db.cleanDb();
  });

  describe('Signup', () => {
    test('One user signup', async () => {
      await signup(user0);
    });

    describe('Signup error', () => {
      beforeEach(async () => {
        await db.cleanDb();
      });

      test('Duplicate key error with code 400 if signup twice with the same user', async () => {
        await signup(user0);
        const res = await signup(user0);
        expect(res.statusCode).toBe(400);
        expect(res.error).toContain('duplicate key error');
      });
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      await db.cleanDb();
      await signup(user0);
    });

    test('Return token encoded with user information when login', async () => {
      await login(user0);
    });

    describe('Login error', () => {
      test('Username or password error', async () => {
        const res = await login(user0WrongPwd);
        expect(res.statusCode).toBe(401);
        expect(res.error).toBe('Invalid user or password');
      });
    });
  });

  describe('After login', () => {
    let tokenRoot: string;
    let tokenUser0: string;
    let idUser0: string;
    let tokenUser1: string;
    let idUser1: string;
    beforeEach(async () => {
      await db.cleanDb();
      await signup(root);
      await signup(user0);
      await signup(user1);
      const rootLogin = await login(root) as LoginResult;
      tokenRoot = rootLogin.token;
      const user0Login = await login(user0) as LoginResult;
      tokenUser0 = user0Login.token;
      idUser0 = user0Login.id;
      const user1Login = await login(user1) as LoginResult;
      tokenUser1 = user1Login.token;
      idUser1 = user1Login.id;
    });

    describe('Logout', () => {
      test('Get 204 if successfully logout', async () => {
        await logout(idUser0, tokenUser0);
      });

      describe('Logout error', () => {
        test('Invalid token error if logout after logout as revoking the token', async () => {
          await logout(idUser0, tokenUser0);
          const resLogout = await logout(idUser0, tokenUser0);
          expect(resLogout.statusCode).toBe(401);
          expect(resLogout.error).toBe('Token invalid');
        });

        test('Invalid token error if logout after login as updating the token', async () => {
          await setTimeout(1000); // jwt.sign() needs 1 sec interval to generate different token
          await login(user0);
          const resLogout = await logout(idUser0, tokenUser0);
          expect(resLogout.statusCode).toBe(401);
          expect(resLogout.error).toBe('Token invalid');
        });

        test('Invalid token error if logout after login is expired', async () => {
          await setTimeout(2000); // Token is expired after 1 sec in the test environment
          const resLogout = await logout(idUser0, tokenUser0);
          expect(resLogout.statusCode).toBe(401);
          expect(resLogout.error).toBe('jwt expired');
        });

        test('Invalid token error if logout with other user id', async () => {
          const resLogout = await logout(idUser0, tokenUser1);
          expect(resLogout.statusCode).toBe(401);
          expect(resLogout.error).toBe('Unauthorized Operation');
        });
      });
    });

    describe('Get All', () => {
      test('Root can get all users', async () => {
        const res = await getAll(tokenRoot);
        expect(res.users).toHaveLength(3);
        expect(res.users?.[0]?.username).toBe('root');
        expect(res.users?.[1]?.username).toBe('user0');
        expect(res.users?.[2]?.username).toBe('user1');
      });

      describe('Get all users error', () => {
        test('Non-root will get 401 error if try to get all users', async () => {
          const res = await getAll(tokenUser0);
          expect(res.statusCode).toBe(401);
          expect(res.error).toBe('Unauthorized Operation');
        });
      });
    });

    describe('Delete', () => {
      test('Get 204 if successfully delete the user', async () => {
        await unregister(idUser0, tokenUser0);
        const res = await getAll(tokenRoot);
        expect(res.users).toHaveLength(2);
      });

      describe('Delete user error', () => {
        test('Get 401 error and no token when login with deleted user', async () => {
          await unregister(idUser0, tokenUser0);
          const res = await login(user0);
          expect(res.statusCode).toBe(401);
          expect(res.error).toBe('Invalid user or password');
          expect(res.token).toBeUndefined();
        });

        test('Get 401 error if user try to delete other user', async () => {
          const res = await unregister(idUser1, tokenUser0);
          expect(res.statusCode).toBe(401);
          expect(res.error).toBe('Unauthorized Operation');
        });
      });
    });
  });
});
