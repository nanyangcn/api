import supertest from 'supertest';

import app from 'src/app';
import db from 'src/utils/db.util';
import { User } from 'src/types/user.type';

const api = supertest(app);

beforeAll(async () => {
  await db.connectDb();
});

afterAll(async () => {
  await db.closeDb();
});

beforeEach(async () => {
  await db.cleanDb();
});

afterEach(async () => {
  await db.cleanDb();
});

describe('Signup', () => {
  const user = {
    username: 'user1',
    password: 'password1',
  };
  test('One user signup', async () => {
    const res = await api.post('/api/signup').send(user);
    const body = res.body as User;
    const { id, username } = body;
    expect(res.statusCode).toEqual(201);
    expect(typeof id).toBe('string');
    expect(username).toBe(user.username);
  });

  test('Duplicate key error with code 400 if signup twice with the same user', async () => {
    await api.post('/api/signup').send(user);
    const res = await api.post('/api/signup').send(user);
    expect(res.statusCode).toEqual(400);
    const body = res.body as { error: string };
    expect(body.error).toContain('duplicate key error');
  });
});
