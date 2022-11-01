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
  interface ResBody extends User {
    error: string
  }
  const res = await api.get(`/api/user/${userId}`)
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
  return {
    statusCode: res.statusCode,
    todos: body.todos,
  };
};

const addTodo = async (todo: TodoReq, token: string) => {
  interface ResBody extends Todo {
    error: string
  }
  const res = await api.post('/api/todo').send(todo)
    .auth(token, { type: 'bearer' });
  const body = res.body as ResBody;
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

const getTodo = async (id: string, token: string) => {
  interface ResBody extends Todo {
    error: string
  }
  const res = await api.get(`/api/todo/${id}`)
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
  return {
    statusCode: res.statusCode,
    todo: body,
  };
};

const deleteTodo = async (id: string, token: string) => {
  interface ResBody {
    error: string
  }
  const res = await api.delete(`/api/todo/${id}`)
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

const putTodo = async (id: string, todo: TodoReq, token: string) => {
  interface ResBody extends Todo {
    error: string
  }
  const res = await api.put(`/api/todo/${id}`).send(todo)
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
  return {
    statusCode: res.statusCode,
    todo: body,
  };
};
const getAllTodos = async (token: string) => {
  interface ResBody extends Array<Todo> {
    error: string
  }
  const res = await api.get('/api/todo')
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
  return {
    statusCode: res.statusCode,
    todos: body,
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
  let tokenRoot: string;
  let tokenUser0: string;
  let idUser0: string;
  let tokenUser1: string;
  let idUser1: string;
  let todo0: TodoReq;
  let todo1: TodoReq;
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
    const rootLogin = await login(root) as LoginResult;
    tokenRoot = rootLogin.token;
    const user0Login = await login(user0) as LoginResult;
    tokenUser0 = user0Login.token;
    idUser0 = user0Login.id;
    const user1Login = await login(user1) as LoginResult;
    tokenUser1 = user1Login.token;
    idUser1 = user1Login.id;
    todo0 = {
      userId: idUser0,
      title: 'todo0',
      description: 'This is todo0',
      done: false,
      deadline: new Date().toISOString(),
    };
    todo1 = {
      userId: idUser1,
      title: 'todo1',
      done: false,
    };
  });

  describe('Add todo', () => {
    test('Should get 201 when successfully add one', async () => {
      const resGet0 = await getUserTodos(idUser0, tokenUser0);
      const numTodos0 = resGet0.todos?.length as number;
      const resAdd0 = await addTodo(todo0, tokenUser0);
      expect(resAdd0.statusCode).toBe(201);
      const resGet1 = await getUserTodos(idUser0, tokenUser0);
      const numTodos1 = resGet1.todos?.length;
      expect(numTodos1).toBe(numTodos0 + 1);
      const resAdd1 = await addTodo(todo1, tokenUser1);
      expect(resAdd1.statusCode).toBe(201);
    });

    describe('Add todo Error', () => {
      test('Should get 401 when add with wrong token', async () => {
        // userId is not matched with token
        const res = await addTodo(todo0, tokenUser1);
        expect(res.statusCode).toBe(401);
        expect(res.error).toBe('Unauthorized Operation');
      });

      test('Should get 400 when add duplicate todo', async () => {
        await addTodo(todo0, tokenUser0);
        const res = await addTodo(todo0, tokenUser0);
        expect(res.statusCode).toBe(400);
        expect(res.error).toContain('duplicate key');
      });
    });
  });

  describe('Get User\'s all todos', () => {
    beforeEach(async () => {
      await addTodo(todo0, tokenUser0);
      await addTodo(todo1, tokenUser1);
    });
    test('Should get 200 when successfully get all', async () => {
      const res0 = await getUserTodos(idUser0, tokenUser0);
      expect(res0.statusCode).toBe(200);
      const numTodos0 = res0.todos?.length as number;
      expect(numTodos0).toBe(1);
      const res1 = await getUserTodos(idUser1, tokenUser1);
      expect(res0.statusCode).toBe(200);
      const numTodos1 = res1.todos?.length;
      expect(numTodos1).toBe(1);
    });

    describe('Get User\'s all todos Error', () => {
      test('Should get 401 when add with wrong token', async () => {
        const res = await getUserTodos(idUser0, tokenUser1);
        expect(res.statusCode).toBe(401);
        expect(res.error).toBe('Unauthorized Operation');
      });
    });
  });

  describe('After add', () => {
    let id0: string;
    let id1: string;
    beforeEach(async () => {
      await addTodo(todo0, tokenUser0);
      const res0 = await getUserTodos(idUser0, tokenUser0);
      id0 = res0.todos?.[0]?.id as string;
      await addTodo(todo1, tokenUser1);
      const res1 = await getUserTodos(idUser1, tokenUser1);
      id1 = res1.todos?.[0]?.id as string;
    });

    describe('Get todo', () => {
      test('Should get 200 when successfully get one', async () => {
        const res0 = await getTodo(id0, tokenUser0);
        expect(res0.statusCode).toBe(200);
        expect(res0.todo?.userId).toBe(idUser0);
        const res1 = await getTodo(id1, tokenUser1);
        expect(res1.statusCode).toBe(200);
        expect(res1.todo?.userId).toBe(idUser1);
      });

      describe('Get todo Error', () => {
        test('Should get 401 when get with wrong token', async () => {
          const res = await getTodo(id0, tokenUser1);
          expect(res.statusCode).toBe(401);
          expect(res.error).toBe('Unauthorized Operation');
        });
      });
    });

    describe('Delete todo', () => {
      test('Should get 204 when successfully delete one', async () => {
        const res = await deleteTodo(id0, tokenUser0);
        expect(res.statusCode).toBe(204);
        const res1 = await getUserTodos(idUser0, tokenUser0);
        expect(res1.todos).toHaveLength(0);
      });

      describe('Delete todo Error', () => {
        test('Should get 401 when delete with wrong token', async () => {
          const res = await deleteTodo(id0, tokenUser1);
          expect(res.statusCode).toBe(401);
          expect(res.error).toBe('Unauthorized Operation');
        });

        test('Should get 404 when get after delete', async () => {
          await deleteTodo(id0, tokenUser0);
          const res = await getTodo(id0, tokenUser0);
          expect(res.statusCode).toBe(404);
          expect(res.error).toBe('Not found');
        });
      });
    });

    describe('Put todo', () => {
      test('Should 200 when successfully put one', async () => {
        const newTodo = {
          ...todo0,
          title: 'newTodo0',
          description: 'This is modified todo0',
          done: true,
          deadline: new Date().toISOString(),
        };
        const res = await putTodo(id0, newTodo, tokenUser0);
        expect(res.statusCode).toBe(200);
        delete res.todo?.id;
        expect(res.todo).toEqual(newTodo);
      });

      describe('Put todo Error', () => {
        test('Should get 401 when add with wrong token', async () => {
          const newTodo = {
            ...todo0,
            title: 'newTodo0',
            description: 'This is modified todo0',
            done: true,
            deadline: new Date().toISOString(),
          };
          const res = await putTodo(id0, newTodo, tokenUser1);
          expect(res.statusCode).toBe(401);
          expect(res.error).toBe('Unauthorized Operation');
        });
      });
    });

    describe('Root gets all todos', () => {
      test('Should get 200 when successfully get all', async () => {
        const res = await getAllTodos(tokenRoot);
        expect(res.statusCode).toBe(200);
        expect(res.todos).toHaveLength(2);
      });

      describe('Root gets all todo Error', () => {
        test('Should get 401 when non-root user get all', async () => {
          const res = await getAllTodos(tokenUser1);
          expect(res.statusCode).toBe(401);
          expect(res.error).toBe('Unauthorized Operation');
        });
      });
    });
  });
});
