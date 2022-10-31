import supertest from 'supertest';

import app from 'src/app';
import db from 'src/utils/db.util';
import { signup, login } from 'tests/integration/user.test';
import { UserReq, User } from 'src/types/user.type';
import { TodoReq, Todo } from 'src/types/todo.type';

const api = supertest(app);

interface LoginResult {
  id: string;
  token: string;
}

const getUserTodos = async (userId: string, token: string) => {
  interface UserBody extends User {
    error: string
  }
  const res = await api.get(`/api/user/${userId}`)
    .auth(token, { type: 'bearer' });
  const body = res.body as UserBody;
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
    todos: body.todos,
  };
};
const addTodo = async (todo: TodoReq, token: string) => {
  interface TodosBody extends Todo {
    error: string
  }
  const res = await api.post('/api/todo').send(todo)
    .auth(token, { type: 'bearer' });
  const body = res.body as TodosBody;
  const { error } = body;
  if (error) {
    return {
      statusCode: res.statusCode,
      error,
    };
  }
  expect(res.statusCode).toBe(201);
  return {
    statusCode: res.statusCode,
    todo: body,
  };
};

describe('Todo test', () => {
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
  // let tokenRoot: string;
  let tokenUser0: string;
  let idUser0: string;
  let tokenUser1: string;
  // let idUser1: string;
  let todo0: TodoReq;
  beforeAll(async () => {
    await db.connectDb();
  });

  afterAll(async () => {
    await db.closeDb();
  });

  beforeEach(async () => {
    await db.cleanDb();
    await signup(root);
    await signup(user0);
    await signup(user1);
    // const rootLogin = await login(root) as LoginResult;
    // tokenRoot = rootLogin.token;
    const user0Login = await login(user0) as LoginResult;
    tokenUser0 = user0Login.token;
    idUser0 = user0Login.id;
    const user1Login = await login(user1) as LoginResult;
    tokenUser1 = user1Login.token;
    // idUser1 = user1Login.id;
    todo0 = {
      userId: idUser0,
      title: 'todo0',
      description: 'This is todo0',
      done: false,
      deadline: new Date().toISOString(),
    };
  });

  describe('Add todo', () => {
    test('Get 201 if successfully add one', async () => {
      const res0 = await getUserTodos(idUser0, tokenUser0);
      const numTodos0 = res0.todos?.length as number;
      await addTodo(todo0, tokenUser0);
      const res1 = await getUserTodos(idUser0, tokenUser0);
      const numTodos1 = res1.todos?.length;
      expect(numTodos1).toBe(numTodos0 + 1);
    });

    describe('Add todo Error', () => {
      test('Get 401 if add with wrong token', async () => {
        // userId is not matched with token
        const res1 = await addTodo(todo0, tokenUser1);
        expect(res1.statusCode).toBe(401);
        expect(res1.error).toBe('Unauthorized Operation');
      });
    });
  });
});
