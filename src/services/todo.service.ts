import todoModel from 'models/todo.model';
import { Todo } from 'types/todo.type';

const fetchTodos = async () => {
  const todos = todoModel.findTodos();
  return todos;
};

const fetchTodoById = async (id: string) => {
  const todo = todoModel.findTodoById(id);
  return todo;
};

const addTodo = async (todo: Todo) => {
  const newTodo = todoModel.addTodo(todo);
  return newTodo;
};

const removeTodoById = async (id: string) => {
  const deleteCount = todoModel.deleteTodoById(id);
  return deleteCount;
};

const replaceTodoById = async (id: string, todo: Todo) => {
  const replaceResult = todoModel.replaceTodoById(id, todo);
  return replaceResult;
};

export default {
  fetchTodos,
  fetchTodoById,
  addTodo,
  removeTodoById,
  replaceTodoById,
};
