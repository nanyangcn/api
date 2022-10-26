import userMongoModel from 'src/models/user.mongo.model';
import { UserReq } from 'src/types/user.type';
import logoutService from 'src/services/logout.service';
import todoService from 'src/services/todo.service';

const fetchUsers = async () => {
  const users = await userMongoModel.findUsers();
  return users;
};

const fetchUserById = async (id: string) => {
  const user = await userMongoModel.findUserById(id);
  return user;
};

const removeUserById = async (id: string) => {
  const user = await fetchUserById(id);
  if (!user || !user.todos) {
    return 0;
  }
  const todoIds = user.todos.map((todo) => (todo.id as string));
  await logoutService.logout(id);
  await todoService.removeTodoByIds(todoIds);

  const deleteCount = await userMongoModel.deleteUserById(id);
  return deleteCount;
};

const replaceUserById = async (id: string, user: UserReq) => {
  const replaceResult = await userMongoModel.replaceUserById(id, user);
  return replaceResult;
};

export default {
  fetchUsers,
  fetchUserById,
  removeUserById,
  replaceUserById,
};
