/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import userController from 'controllers/user.controller';

const router = express.Router();

router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/user/:id', userController.putUser);

export default router;
