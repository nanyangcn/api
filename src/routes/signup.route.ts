/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';

import signupController from 'src/controllers/signup.controller';

const router = express.Router();

router.post('/signup', signupController.signup);

export default router;
