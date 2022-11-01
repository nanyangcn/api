import express from 'express';

import loginController from 'src/controllers/login.controller';

const router = express.Router();

router.post('/login', loginController.postLogin);

export default router;
