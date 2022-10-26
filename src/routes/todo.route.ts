/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import todoController from 'src/controllers/todo.controller';

const router = express.Router();

// router.get('/todo', todoController.getTodos);
router.get('/todo/:id', todoController.getTodo);
router.post('/todo', todoController.postTodo);
router.delete('/todo/:id', todoController.deleteTodo);
router.put('/todo/:id', todoController.putTodo);

export default router;
