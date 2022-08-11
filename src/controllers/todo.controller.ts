import { Request, Response, NextFunction } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import todoService from 'services/todo.service';
import { Todo } from 'types/todo.type';

const getTodos = (_req: Request, res: Response<Todo[]>, next: NextFunction) => {
  todoService.fetchTodos()
    .then((todos) => {
      res.send(todos);
    })
    .catch((err) => {
      next(err);
    });
};

const getTodo = (
  req: Request<ParamsDictionary, Todo, Todo>,
  res: Response<Todo | string>,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send('Missing id');
  } else {
    todoService.fetchTodoById(id)
      .then((todo) => {
        if (!todo) {
          res.status(404).send('Todo not found');
        } else {
          res.json(todo);
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

const postTodo = (
  req: Request<ParamsDictionary, Todo, Todo>,
  res: Response<Todo>,
  next: NextFunction,
) => {
  todoService.addTodo(req.body)
    .then((newTodo) => {
      res.json(newTodo);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteTodo = (
  req: Request<ParamsDictionary, Todo, Todo>,
  res: Response<Todo | string>,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send('Missing id');
  } else {
    todoService.removeTodoById(id)
      .then((count) => {
        if (count === 0) {
          res.status(404).send('Todo not found');
        } else {
          res.status(204).end();
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

const putTodo = (
  req: Request<ParamsDictionary, Todo, Todo>,
  res: Response<Todo | string>,
  next: NextFunction,
) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send('Missing id');
  } else {
    todoService.replaceTodoById(id, req.body)
      .then(({ count, todo }) => {
        if (count === 0) {
          res.status(404).send('Todo not found');
        } else {
          res.json(todo);
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

export default {
  getTodos,
  getTodo,
  postTodo,
  deleteTodo,
  putTodo,
};
