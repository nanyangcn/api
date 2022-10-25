/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import loginController from 'controllers/login.controller';

const router = express.Router();

router.post('/login', loginController.postLogin);

export default router;
